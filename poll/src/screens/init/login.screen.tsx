import React, {useState} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppNavigation} from '../../app.navigator.tsx';
import {privateKeyToAccount} from 'viem/accounts';
import {Hex} from 'viem';
import {Alert} from 'react-native';
import {useCreateUser} from '../../store/user/hook.ts';

const StyledInput = styled.TextInput`
  border: 2px solid #34495e;
  background-color: #f5f5f5;
  margin: 12px 0;
  padding: 12px;
  font-size: 18px;
  border-radius: 8px;
  color: #333;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #34495e;
  padding: 10px 20px;
  margin-top: 30px;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

export const LoginScreen = () => {
  const [privateKey, setPrivateKey] = useState('');

  const createUser = useCreateUser();
  const navigation = useAppNavigation();
  const handleSubmit = () => {
    const account = privateKeyToAccount(privateKey as Hex);
    const address = account.address;
    fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 0) {
          Alert.alert(data.msg);
        } else {
          createUser({
            id: data.real_id,
            name: data.name,
            address,
            privateKey,
          });
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <SafeAreaView style={{padding: 20}}>
      <StyledInput
        placeholder="PrivateKey"
        value={privateKey}
        onChangeText={setPrivateKey}
      />
      <StyledButton onPress={handleSubmit}>
        <ButtonText>Login</ButtonText>
      </StyledButton>
    </SafeAreaView>
  );
};
