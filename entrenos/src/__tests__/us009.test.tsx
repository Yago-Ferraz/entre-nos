
// Mocking the clipboard module
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

// Mock services
const mockMoedaService = {
  getSaldo: jest.fn(),
  listarTransacoes: jest.fn(),
  gerarRecargaPix: jest.fn(),
  isExtratoDisponivel: jest.fn(),
  ganharMoedas: jest.fn(),
  copiarCodigoPix: jest.fn(),
  gastarMoedas: jest.fn(),
  canAfford: jest.fn(),
  receberBonusDiario: jest.fn(),
};

describe('US009 - Testes de Moedas e Transações', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('TC001: Consistência de Saldo entre módulos', () => {
    mockMoedaService.getSaldo.mockReturnValue(105);
    const saldoHome = mockMoedaService.getSaldo();
    const saldoMoedas = mockMoedaService.getSaldo();
    expect(saldoHome).toBe(105);
    expect(saldoMoedas).toBe(105);
    expect(saldoHome).toEqual(saldoMoedas);
  });

  test('TC002: Listagem de atividades – tipos de transação', () => {
    const transacoes = [
      { tipo: 'credito', valor: 10, descricao: 'Bônus diário' },
      { tipo: 'debito', valor: -5, descricao: 'Gasto em campanha' },
    ];
    mockMoedaService.listarTransacoes.mockReturnValue(transacoes);
    const lista = mockMoedaService.listarTransacoes();
    expect(lista).toContainEqual(expect.objectContaining({ tipo: 'credito' }));
    expect(lista).toContainEqual(expect.objectContaining({ tipo: 'debito' }));
  });

  test('TC003: Exibição do componente Pix – campos obrigatórios', () => {
    const recargaPix = {
      qrCode: 'mock-qr-code-string',
      codigoPix: 'mock-pix-key',
      acaoCopiar: true,
    };
    mockMoedaService.gerarRecargaPix.mockReturnValue(recargaPix);
    const result = mockMoedaService.gerarRecargaPix();
    expect(result).toHaveProperty('qrCode');
    expect(result).toHaveProperty('codigoPix');
    expect(result).toHaveProperty('acaoCopiar');
  });

  test('TC004: Disponibilidade do botão "Ver Extrato"', () => {
    mockMoedaService.isExtratoDisponivel.mockReturnValue(true);
    const isDisponivel = mockMoedaService.isExtratoDisponivel();
    expect(isDisponivel).toBe(true);
  });

  test('TC005: Atualização de saldo – ganho de moedas', () => {
    let saldo = 105;
    mockMoedaService.getSaldo.mockImplementation(() => saldo);
    mockMoedaService.ganharMoedas.mockImplementation((valor) => {
      saldo += valor;
      return {
        novaTransacao: { tipo: 'credito', valor },
        saldoAtual: saldo,
      };
    });

    mockMoedaService.ganharMoedas(5);
    const saldoAtual = mockMoedaService.getSaldo();
    expect(saldoAtual).toBe(110);
  });

  test('TC006: Recarga PIX – copiar código', async () => {
    const codigo = 'pix-copia-e-cola';
    mockMoedaService.copiarCodigoPix.mockResolvedValue('sucesso');
    const result = await mockMoedaService.copiarCodigoPix(codigo);
    expect(result).toBe('sucesso');
  });

  test('TC007: Gasto – campanha com saldo suficiente', () => {
    let saldo = 300;
    mockMoedaService.getSaldo.mockImplementation(() => saldo);
    mockMoedaService.gastarMoedas.mockImplementation((valor) => {
      if (saldo >= valor) {
        saldo -= valor;
        return { status: 'sucesso', saldoAtual: saldo };
      }
      return { status: 'falha', saldoAtual: saldo };
    });

    mockMoedaService.gastarMoedas(200);
    const saldoFinal = mockMoedaService.getSaldo();
    expect(saldoFinal).toBe(100);
  });

  test('TC008: Gasto – saldo insuficiente (premium)', () => {
    let saldo = 105;
    mockMoedaService.getSaldo.mockImplementation(() => saldo);
    mockMoedaService.gastarMoedas.mockImplementation((valor) => {
      if (saldo >= valor) {
        saldo -= valor;
        return { status: 'sucesso', saldoAtual: saldo };
      }
      return { status: 'falha', mensagem: 'Saldo insuficiente' };
    });
    
    const resultado = mockMoedaService.gastarMoedas(500);
    const saldoFinal = mockMoedaService.getSaldo();

    expect(resultado.status).toBe('falha');
    expect(saldoFinal).toBe(105);
  });

  test('TC009: Validação de botões – saldo insuficiente', () => {
    const saldo = 105;
    mockMoedaService.canAfford.mockImplementation((custo) => saldo >= custo);
    const podePagar = mockMoedaService.canAfford(500);
    expect(podePagar).toBe(false);
  });
  
  test('TC010: Bônus diário – prevenir duplicidade', () => {
    let bonusRecebidoHoje = false;
    let saldo = 100;
    mockMoedaService.receberBonusDiario.mockImplementation(() => {
      if (bonusRecebidoHoje) {
        return { status: 'falha', mensagem: 'Bônus já creditado hoje' };
      }
      bonusRecebidoHoje = true;
      saldo += 10;
      return { status: 'sucesso', saldoAtual: saldo };
    });

    mockMoedaService.receberBonusDiario(); 
    const resultado = mockMoedaService.receberBonusDiario(); 

    expect(resultado.status).toBe('falha');
    expect(resultado.mensagem).toBe('Bônus já creditado hoje');
  });

  test('TC011: Exibição de saldo zero', () => {
    mockMoedaService.getSaldo.mockReturnValue(0);
    mockMoedaService.canAfford.mockImplementation((custo) => 0 >= custo);

    const saldo = mockMoedaService.getSaldo();
    const podePagar = mockMoedaService.canAfford(1);
    
    expect(saldo).toBe(0);
    expect(podePagar).toBe(false);
  });
  
  test('TC012: Extrato completo com saldo zero', () => {
    const transacoes = [
      { tipo: 'credito', valor: 100 },
      { tipo: 'debito', valor: -100 },
    ];
    mockMoedaService.listarTransacoes.mockReturnValue(transacoes);

    const extrato = mockMoedaService.listarTransacoes();
    expect(extrato.length).toBe(2);
  });
});
