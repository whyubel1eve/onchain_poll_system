import React, {useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useRemoveUser, useUser} from '../../store/user/hook.ts';
import {useAppNavigation} from '../../app.navigator.tsx';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAddressCard,
  faCopy,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

const PageContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f0f4f8; // Lighter background for a more modern look
`;

const ProfileSection = styled.View`
  align-items: center;
  margin-bottom: 40px; // Increased margin for better spacing
`;

const ProfileImage = styled.Image`
  width: 140px; // Slightly larger image for focus
  height: 140px;
  border-radius: 70px; // Adjusted for the increased size
  margin-bottom: 15px;
`;

const NameText = styled.Text`
  font-size: 24px; // Larger font size for emphasis
  font-weight: bold;
  color: #2c3e50; // Darker color for better readability
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0; // Increased padding for better touchability
  border-bottom-width: 1px; // Separator for clarity
  border-bottom-color: #e5e7eb; // Light color for subtlety
`;

const DetailText = styled.Text`
  font-size: 18px; // Increased font size for readability
  color: #34495e; // Slightly darker for emphasis
  margin-right: 10px;
  margin-left: 10px;
  font-weight: normal;
`;

const Button = styled.TouchableOpacity`
  background-color: #34495e; // Adjusted color for consistency
  padding: 12px 25px; // Increased padding for better ergonomics
  border-radius: 10px; // More pronounced curves for a modern look
  align-items: center;
  justify-content: center;
  margin-top: 25px; // Increased margin for separation
  shadow-color: #000; // Shadow for depth
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const Combine = styled.View`
  flex-direction: row;
`;
const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px; // Larger font for emphasis
  font-weight: 600; // Increased weight for readability
`;

const ButtonArea = styled.View`
  flex: 1;
  margin-top: 27px;
`;

export const UserProfileScreen = () => {
  const [showId, setShowId] = useState(false);

  const user = useUser();
  const removeUser = useRemoveUser();
  const navigation = useAppNavigation();

  const id = user.id;
  const address = user.address;
  const showedAddress =
    address &&
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const toggleShowId = () => setShowId(!showId);

  const handleCopyAddress = async () => {
    Clipboard.setString(address);
    Alert.alert('Copied', 'Address has been copied to clipboard.');
  };

  const handleLogout = () => {
    removeUser();
    navigation.navigate('Onboard');
    // Alert.alert('Logged Out', 'You have successfully logged out.');
  };

  const handleExportPrivateKey = () => {
    const priv = user.privateKey;
    Clipboard.setString(priv);
    Alert.alert(
      'Private Key',
      'Your private key has been copied to clipboard.',
    );
  };

  return (
    <PageContainer>
      <ProfileSection>
        <ProfileImage source={{uri: 'https://i.pravatar.cc/300'}} />
        <NameText>{user.name}</NameText>
      </ProfileSection>
      <TouchableOpacity onPress={toggleShowId}>
        <DetailRow>
          <Combine>
            <FontAwesomeIcon icon={faAddressCard} color={'#1a4272'} size={20} />
            <DetailText>ID:</DetailText>
          </Combine>
          <DetailText>{showId ? id : '••••••'}</DetailText>
        </DetailRow>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCopyAddress}>
        <DetailRow>
          <Combine>
            <FontAwesomeIcon icon={faWallet} color={'#1a4272'} size={20} />
            <DetailText>Address:</DetailText>
          </Combine>
          <Combine>
            <DetailText>{showedAddress}</DetailText>
            <FontAwesomeIcon icon={faCopy} color={'#1a4272'} size={20} />
          </Combine>
        </DetailRow>
      </TouchableOpacity>
      <ButtonArea>
        <Button onPress={handleLogout}>
          <ButtonText>Logout</ButtonText>
        </Button>
        <Button onPress={handleExportPrivateKey}>
          <ButtonText>Export PrivateKey</ButtonText>
        </Button>
      </ButtonArea>
    </PageContainer>
  );
};
