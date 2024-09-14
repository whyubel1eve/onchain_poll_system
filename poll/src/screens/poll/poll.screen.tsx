import React, {useState} from 'react';
import {Alert, Dimensions, Image, ScrollView, Text} from 'react-native';
import styled from 'styled-components/native';
import {useUser} from '../../store/user/hook.ts';
import {v4 as uuidv4} from 'uuid';
import {useContract} from '../../contract/hook.ts';
import {privateKeyToAccount} from 'viem/accounts';
import {hashMessage, hexToSignature} from 'viem';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {launchImageLibrary} from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;

const Container = styled.View`
  padding: 10px 20px 0 20px;
  background-color: #f0f2f5;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const StyledInput = styled.TextInput`
  background-color: #ffffff;
  margin: 15px 0 10px 0;
  padding: 15px;
  font-size: 16px;
  color: #333;
  border-radius: 8px;
  shadow-opacity: 0.1;
  shadow-radius: 3.5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  flex: 1;
`;

const Form = styled.View`
  //justify-content: center;
  //align-items: center;
  width: 100%;
  border: 1px solid #2c3e50;
  border-radius: 10px;
  padding: 25px 20px 25px 20px;
  margin-bottom: 20px;
`;
const OptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #2c3e50;
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  shadow-opacity: 0.15;
  shadow-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
`;

const AddOption = styled.TouchableOpacity`
  flex-direction: row;
  margin: 10px 0;
`;
const AddOptionText = styled.Text`
  color: #2c3e50;
  margin-left: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 8px;
  margin-left: 10px;
`;

// const OptionIcon = styled(FontAwesomeIcon)`
//   margin-right: 10px;
// `;

export const PollScreen = () => {
  const [eventName, setEventName] = useState('');
  const [options, setOptions] = useState([{key: Date.now(), name: ''}]);
  const [ticket, setTicket] = useState(0);
  const [imageUri, setImageUri] = useState<any>(null);

  const user = useUser();
  const contract = useContract();

  const handleChoosePhoto = async () => {
    await launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleAddOption = () => {
    setOptions([...options, {key: Date.now(), name: ''}]);
  };

  const handleTicket = (a: string) => {
    try {
      const amount = parseInt(a);
      setTicket(amount);
    } catch {
      Alert.alert('please input a real amount');
    }
  };
  const handleRemoveOption = (key: number) => {
    setOptions(options.filter(option => option.key !== key));
  };

  const handleOptionChange = (key: number, text: string) => {
    const newOptions = options.map(option => {
      if (option.key === key) {
        return {...option, name: text};
      }
      return option;
    });
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    const uid = uuidv4();
    const candidates = options.map(option => {
      return option.name;
    });

    const tx_hash = await contract.write.createPollEvent([uid, candidates]);

    const account = privateKeyToAccount(user.privateKey);

    let tokens = [];

    for (let i = 0; i < ticket; i++) {
      const uuid = uuidv4();
      const hash = hashMessage(uuid);

      const signature = await account.signMessage({
        message: uuid,
      });

      const {r, s, yParity} = hexToSignature(signature);
      const v = (yParity as number) + 27;

      const token = {
        hash,
        r,
        s,
        v,
        isIssued: false,
      };
      tokens.push(token);
    }

    await fetch('http://localhost:3000/event/createEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        name: eventName,
        creator: user.address,
        options: candidates,
        ticket,
        remained_ticket: ticket,
        tokens,
        image_url: imageUri,
        hash: tx_hash,
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
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
    Alert.alert('Poll Submitted', 'Your poll has been successfully submitted!');
    console.log('Hash: ', tx_hash);
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title>Create A Poll Event</Title>
        <Form>
          <StyledInput
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
          />
          {options.map((option, index) => (
            <OptionContainer key={option.key}>
              <StyledInput
                placeholder={`Option ${index + 1}`}
                value={option.name}
                onChangeText={text => handleOptionChange(option.key, text)}
              />
              {options.length > 1 && (
                <RemoveButton onPress={() => handleRemoveOption(option.key)}>
                  <Text style={{color: '#fff'}}>Remove</Text>
                </RemoveButton>
              )}
            </OptionContainer>
          ))}
          <AddOption onPress={handleAddOption}>
            <FontAwesomeIcon icon={faCirclePlus} color={'#2c3e50'} size={16} />
            <AddOptionText>Add Option</AddOptionText>
          </AddOption>
          <StyledInput
            placeholder={`Ticket Amount`}
            onChangeText={text => handleTicket(text)}
          />
          {imageUri && (
            <>
              <Image
                source={{uri: imageUri}}
                style={{
                  marginTop: 10,
                  width: windowWidth - 85,
                  height: 180,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />
              {/*<Button title="Upload to IPFS" onPress={uploadToIPFS} />*/}
            </>
          )}
          <Button onPress={handleChoosePhoto}>
            <ButtonText>Choose Photo</ButtonText>
          </Button>
        </Form>
        <Button onPress={handleSubmit}>
          <ButtonText>Submit Poll</ButtonText>
        </Button>
      </ScrollView>
    </Container>
  );
};
