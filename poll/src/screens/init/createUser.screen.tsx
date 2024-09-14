import React, {useState} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppNavigation} from '../../app.navigator.tsx';
import {useCreateUser} from '../../store/user/hook.ts';
import {generatePrivateKey, privateKeyToAccount} from 'viem/accounts';

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

export const CreateUserScreen = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const navigation = useAppNavigation();
  const createUser = useCreateUser();
  const handleSubmit = () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const address = account.address;

    createUser({
      name,
      id,
      address,
      privateKey,
    });

    fetch('http://localhost:3000/user/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        real_id: id,
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
        console.log(data);
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };

  return (
    <SafeAreaView style={{padding: 20}}>
      <StyledInput placeholder="Name" value={name} onChangeText={setName} />
      <StyledInput placeholder="ID" value={id} onChangeText={setId} />
      <StyledButton onPress={handleSubmit}>
        <ButtonText>Create User</ButtonText>
      </StyledButton>
    </SafeAreaView>
  );
};
