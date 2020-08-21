import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  Description,
  Okbutton,
  OkButtonText,
} from './styles';
import { useNavigation } from '@react-navigation/native';

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);
  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>Pode escrever qualquer coisa se quiser</Description>

      <Okbutton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </Okbutton>
    </Container>
  );
};

export default AppointmentCreated;
