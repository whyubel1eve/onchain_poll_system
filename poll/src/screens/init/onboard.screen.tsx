import React from 'react';
import styled from 'styled-components/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppNavigation} from '../../app.navigator.tsx';

const StyledButton = styled.TouchableOpacity`
  background-color: #34495e;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 10px;
  align-items: center;
  width: 100%;
  height: 40px;
`;
const PollImg = styled.Image`
  height: 300px;
  width: 300px;
  border-radius: 30px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 20px;
  font-family: PermanentMarker-Regular;
`;
const Description = styled.Text`
  font-weight: normal;
  font-size: 18px;
  color: grey;
  margin-bottom: 20px;
  font-family: Jersey15-regular;
`;
const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

export const OnboardScreen = () => {
  const navigation = useAppNavigation();
  const handleSignUp = () => {
    navigation.navigate('CreateUser');
  };
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <PollImg
        resizeMode={'contain'}
        source={require('../../assets/img/poll.png')}
      />
      <Title>AnonPoll</Title>
      <Description>
        Your absolutely anonymous and smooth poll application
      </Description>
      <StyledButton onPress={handleSignUp}>
        <ButtonText>Sign Up</ButtonText>
      </StyledButton>
      <StyledButton onPress={handleLogin}>
        <ButtonText>Login</ButtonText>
      </StyledButton>
    </SafeAreaView>
  );
};
