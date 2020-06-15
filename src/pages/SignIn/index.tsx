// não pode colocar texto na aplicação sem uma tag de texto por volta
//Ref: Referencias são formas de acesar/munipular funções de um elemento de uma foma direta
import React, { useCallback, useRef } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccontButton,
  CreateAccontButtonText,
} from './styles';

interface SingInFormData {
  email: string;
  password: string;
}

import logoImg from '../../assets/logo.png';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { singIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail valido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await singIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
    },
    [singIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }} // ajusta para ocupar todo o expaçamento da tela
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView // adciona escrol no ISO e clickar fora da tela esconde o teclado em ambos OS
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false} //remove a correção automatica do teclado.
                autoCapitalize="none" //remove a caixa auto do teclado
                keyboardType="email-address" //adiociona @ no teclado
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next" //adiociona batão de proximo
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus(); // executa função de focus de pai para filho
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry //adiciona campo do tipo password
                returnKeyType="send" //adiciona botão de submit no teclado
                onSubmitEditing={() => {
                  //executa função para que o botaão send funcione
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccontButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccontButtonText>Criar um conta</CreateAccontButtonText>
      </CreateAccontButton>
    </>
  );
};

export default SignIn;
