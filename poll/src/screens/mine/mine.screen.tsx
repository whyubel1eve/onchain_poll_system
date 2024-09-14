import React from 'react';
import styled from 'styled-components/native';
import {useAppNavigation} from '../../app.navigator.tsx';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBook, faMarker, faMessage} from '@fortawesome/free-solid-svg-icons';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const Card = styled.TouchableOpacity`
  width: 90%;
  height: 25%;
  margin: 10px 0;
  padding: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
  margin-bottom: 50px;
`;

const CardText = styled.Text`
  font-size: 20px;
  margin-left: 20px;
  color: #333333;
  font-weight: bold;
`;

const FloatingActionButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: #34495e;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

export function MineScreen() {
  const navigation = useAppNavigation();
  const handlePress = (card: string) => {
    if (card === 'My Events') {
      navigation.navigate('MyEvents');
    } else if (card === 'My Applications') {
      navigation.navigate('MyApplications');
    }
  };

  return (
    <Container>
      <Card onPress={() => handlePress('My Events')} activeOpacity={0.8}>
        <FontAwesomeIcon icon={faBook} color={'black'} size={20} />
        <CardText>My Events</CardText>
      </Card>
      <Card onPress={() => handlePress('My Applications')} activeOpacity={0.8}>
        <FontAwesomeIcon icon={faMarker} color={'black'} size={20} />
        <CardText>My Applications</CardText>
      </Card>
      <FloatingActionButton onPress={() => navigation.navigate('Application')}>
        <FontAwesomeIcon icon={faMessage} color={'white'} size={20} />
      </FloatingActionButton>
    </Container>
  );
}
