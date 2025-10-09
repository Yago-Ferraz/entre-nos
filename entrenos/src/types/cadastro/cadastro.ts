
export type FormDataCadastroLojaType = {
    userType: string,
    name: string,
    phone: string,
    cnpj: string,
    password: string,
    confirmPassword: string,
    categoria: string
};

export type StepProps = {
  formData: FormDataCadastroLojaType;
  setFormData: (data: FormDataCadastroLojaType) => void;
    onNext: () => void;
    onDecline: () => void;
};