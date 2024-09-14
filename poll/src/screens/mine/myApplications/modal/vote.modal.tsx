import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheckCircle, faCircle} from '@fortawesome/free-solid-svg-icons';
import {useAdminContract} from '../../../../contract/hook.ts';

type Option = {
  selected: boolean;
};
const StyledBottomSheetView = styled(BottomSheetView)`
  padding: 20px;
`;

const EventName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const OptionContainer = styled.TouchableOpacity<Option>`
  flex-direction: row;
  align-items: center;
  background-color: ${({selected}: any) =>
    selected ? '#e8f4ff' : 'transparent'};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const OptionText = styled.Text<Option>`
  font-size: 18px;
  margin-left: 10px;
  font-weight: ${({selected}: any) => (selected ? 'bold' : 'normal')};
  color: ${({selected}: any) => (selected ? '#007AFF' : '#555')};
`;

const UIDText = styled.Text`
  font-size: 16px;
  color: #777;
  margin-top: 20px;
`;

const CreatorText = styled.Text`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;
const DisableButton = styled.TouchableOpacity`
  background-color: #cac8c8;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

type Props = {
  bottomSheetModalRef: any;
  item: any;
};

export function VoteModal({bottomSheetModalRef, item}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<number>();

  const [data, setData] = useState<any>();
  const [hasVoted, setHasVoted] = useState(false);

  const contract = useAdminContract();

  const handleSelectOption = (option: string, id: number) => {
    setSelectedOption(option);
    setSelectId(id + 1);
  };

  const queryVoteStatus = useCallback(
    async (hash: string) => {
      const res = (await contract.read.hasVoted([hash])) as boolean;
      console.log(res);
      setHasVoted(res);
    },
    [contract],
  );

  const queryToken = useCallback(() => {
    if (!item) {
      return;
    }
    fetch(
      `http://localhost:3000/application/queryToken?token_id=${item.token_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const res = data.res[0];
        setData(res);
        console.log(
          item.uid,
          selectId,
          res.hash,
          res.v,
          res.r,
          res.s,
          item.creator,
        );
        queryVoteStatus(res.hash);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [item, selectId]);

  useEffect(() => {
    queryToken();
  }, [queryToken]);

  const handleSubmit = async () => {
    if (!selectedOption) {
      Alert.alert(
        'Selection Required',
        'Please select an option before submitting.',
      );
      return;
    }

    if (selectId !== undefined) {
      const tx_hash = await contract.write.vote([
        item.uid,
        BigInt(selectId),
        data.hash,
        data.v,
        data.r,
        data.s,
        item.creator,
      ]);
      console.log(tx_hash);
      if (tx_hash) {
        await fetch(`http://localhost:3000/event/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.event_id,
          }),
        });
      }
    }

    bottomSheetModalRef.current.dismiss();

    Alert.alert(
      'Submission Successful',
      `You have selected: ${selectedOption}`,
    );
    console.log('Selected Option: ', selectedOption);
  };

  return (
    <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={['85%']}>
      <StyledBottomSheetView>
        <EventName>{item?.name}</EventName>
        {item?.options.map((option: any, index: number) => (
          <OptionContainer
            key={index}
            selected={selectedOption === option}
            onPress={() => handleSelectOption(option, index)}>
            <FontAwesomeIcon
              icon={selectedOption === option ? faCheckCircle : faCircle}
              color={selectedOption === option ? '#007AFF' : '#ccc'}
              size={20}
            />
            <OptionText selected={selectedOption === option}>
              {option}
            </OptionText>
          </OptionContainer>
        ))}
        <UIDText>uid: {item?.uid}</UIDText>
        <CreatorText>
          creator: {item?.creator.substring(0, 6)}...
          {item?.creator.substring(item.creator.length - 4)}
        </CreatorText>
        {hasVoted ? (
          <DisableButton disabled={true}>
            <ButtonText>You have already voted</ButtonText>
          </DisableButton>
        ) : (
          <SubmitButton onPress={handleSubmit}>
            <ButtonText>Vote</ButtonText>
          </SubmitButton>
        )}
      </StyledBottomSheetView>
    </BottomSheetModal>
  );
}
