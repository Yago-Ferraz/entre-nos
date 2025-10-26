
export type FormDataCadastroLojaType = {
    userType: number,
    name: string,
    phone: string,
    documento: string,
    password: string,
    confirmPassword: string,
    categoria: number,
    fotos: string[],
    logo: string,
    descricao: string;
    email: string;
    
};

export type StepProps = {
  formData: FormDataCadastroLojaType;
  setFormData: (data: FormDataCadastroLojaType) => void;
    onNext: () => void;
    onDecline: () => void;
};