import React, {useCallback, useEffect, useState} from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {PollEvent} from '../type';
import {useUser} from '../../../store/user/hook.ts';
import {
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryTheme,
} from 'victory-native';
import {Dimensions, ScrollView} from 'react-native';
import {useContract} from '../../../contract/hook.ts';

const StyledBottomSheetView = styled(BottomSheetView)`
  padding: 20px;
  margin-bottom: 20px;
  flex: 1;
`;

const EventName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const OptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const StyledText = styled.Text`
  font-size: 18px;
  margin-left: 10px;
  font-weight: bold;
  color: #2c3e50;
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

const Chart = styled.View`
  justify-content: center;
  align-items: center;
`;
const Spacing = styled.View`
  margin-top: 20px;
`;

const Banner = styled.Image`
  width: 100%;
  height: 160px;
  align-self: center;
  border-radius: 10px;
  margin: 20px 0;
`;

type Props = {
  bottomSheetModalRef: any;
  item: PollEvent | undefined;
};

const windowWidth = Dimensions.get('window').width;

// const windowHeight = Dimensions.get('window').height;

export function DetailsModal({bottomSheetModalRef, item}: Props) {
  const [hasApplied, setHasApplied] = useState<boolean>();
  const user = useUser();
  const contract = useContract();
  const [data, setData] = useState<any>([]);

  const [displayChart, setDisplayChart] = useState(false);

  const queryDetails = useCallback(async () => {
    const length = (await contract.read.getCandidateCount([
      item?.uid,
    ])) as number;
    let res = [];
    let count = 0;
    for (let i = 0; i < length; i++) {
      const candidate: any = await contract.read.eventList([
        item?.uid,
        BigInt(i),
      ]);
      count += parseInt(candidate[2].toString(), 10);
      res.push({x: candidate[1], y: parseInt(candidate[2].toString())});
    }
    if (count !== 0) {
      setDisplayChart(true);
    } else {
      setDisplayChart(false);
    }
    setData(res);
  }, [contract, item]);

  const queryStatus = useCallback(() => {
    if (!item) {
      return;
    }
    fetch(
      `http://localhost:3000/application/queryApplicationByEventId?applicant=${user.address}&event_id=${item?.id}`,
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
        if (data.status === 0) {
          setHasApplied(false);
        } else {
          setHasApplied(true);
        }
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [item, user.address]);

  useEffect(() => {
    queryStatus();
    queryDetails();
  }, [queryDetails, queryStatus]);

  const handleSubmit = async () => {
    // Here, handle the submission logic with selectedOption
    const status = item?.creator === user.address ? 'approved' : 'inProgress';

    fetch('http://localhost:3000/application/createApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: item?.id,
        applicant_name: user.name,
        applicant_address: user.address,
        status: status,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (status === 'approved') {
          fetch('http://localhost:3000/application/handleApplication', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: status,
              id: data.id,
            }),
          });
        }
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
    queryStatus();
    await queryDetails();
    bottomSheetModalRef.current.dismiss();
  };

  return (
    <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={['85%']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StyledBottomSheetView>
          {item?.image_url && <Banner source={{uri: item?.image_url}} />}
          <EventName>{item?.name}</EventName>
          {item?.options.map((option, index) => (
            <OptionContainer key={index}>
              {/*<FontAwesomeIcon icon={faCircle} color={'#007AFF'} size={20} />*/}
              <StyledText>Option {index + 1} :</StyledText>
              <StyledText>{option}</StyledText>
            </OptionContainer>
          ))}
          {displayChart && (
            <Chart>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{x: 30}}
                width={windowWidth - 50}>
                <VictoryBar barWidth={30} data={data} />
              </VictoryChart>
              <Spacing />
              <VictoryPie
                data={data}
                width={windowWidth - 50}
                animate={{
                  duration: 1000,
                }}
                theme={VictoryTheme.material}
                labels={({datum}) => `${datum.x}: ${datum.y}`}
                // startAngle={90}
                // endAngle={450}
              />
            </Chart>
          )}
          <UIDText>uid: {item?.uid}</UIDText>
          <CreatorText>
            creator: {item?.creator.substring(0, 6)}...
            {item?.creator.substring(item.creator.length - 4)}
          </CreatorText>
          {item?.remained_ticket === 0 ? (
            <DisableButton disabled={true}>
              <ButtonText>The event is over</ButtonText>
            </DisableButton>
          ) : hasApplied ? (
            <DisableButton disabled={true}>
              <ButtonText>You have already applied</ButtonText>
            </DisableButton>
          ) : (
            <SubmitButton onPress={handleSubmit}>
              <ButtonText>Apply</ButtonText>
            </SubmitButton>
          )}
        </StyledBottomSheetView>
      </ScrollView>
    </BottomSheetModal>
  );
}
