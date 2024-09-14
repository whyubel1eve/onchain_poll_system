import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DetailsModal} from './modal/details.modal.tsx';
import {PollEvent} from './type';
import {Dimensions, RefreshControl} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHourglassHalf, faStopwatch} from '@fortawesome/free-solid-svg-icons';

const windowWidth = Dimensions.get('window').width;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
`;

const EventList = styled.FlatList`
  width: 100%;
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
`;

const EventCard = styled.TouchableOpacity`
  flex-direction: row;
  align-self: center;
  margin: 20px 0;
  height: 120px;
  background-color: #ffffff;
  border: none;
  border-radius: 15px;
  padding: 20px 0 20px 20px;
  width: 90%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardText = styled.Text`
  font-size: 18px;
  color: #333;
  font-weight: bold;
`;

const StatusBar = styled.View`
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
`;

const CreatorText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const ContentPart = styled.View`
  flex: 1.3;
`;
const ImagePart = styled.Image`
  height: 120px;
  margin-left: 10px;
  flex: 1.2;
  border-radius: 0 10px 10px 0;
  align-self: center;
`;

const Over = styled.Text`
  color: red;
  margin-left: 10px;
`;

const InProgress = styled.Text`
  margin-left: 10px;
  color: green;
`;

const Left = styled.Text`
  margin-left: 10px;
  color: #1d4aa0;
`;

const fetchData = async () => {
  const response = await fetch('http://localhost:3000/event/queryAllEvents', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function EventsScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [item, setItem] = useState<PollEvent>();

  const [refreshing, setRefreshing] = useState(false);

  const handlePresentPress = (item: PollEvent) => {
    setItem(item);
    // @ts-ignore
    bottomSheetModalRef.current.present();
  };

  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    const result = await fetchData();
    if (!data || JSON.stringify(result) !== JSON.stringify(data)) {
      setData(result.res);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await Promise.race([setTimeout(() => {}, 2000), getData()]);
    setRefreshing(false);
  }, [getData]);
  // @ts-ignore
  const renderItem = ({item}) => {
    return (
      <EventCard onPress={() => handlePresentPress(item)}>
        <ContentPart>
          <CardText>{item.name}</CardText>
          <StatusBar>
            <CreatorText>{`creator: ${item.creator.substring(
              0,
              6,
            )}...${item.creator.substring(
              item.creator.length - 4,
            )}`}</CreatorText>
          </StatusBar>
          <StatusBar>
            {item.remained_ticket === 0 ? (
              <Row>
                <FontAwesomeIcon icon={faStopwatch} color={'red'} size={16} />
                <Over>Over</Over>
              </Row>
            ) : (
              <Row>
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  color={'green'}
                  size={16}
                />
                <InProgress>In Progress</InProgress>
                <Left>
                  ({item.remained_ticket}/{item.ticket})
                </Left>
              </Row>
            )}
          </StatusBar>
        </ContentPart>
        {item.image_url && <ImagePart source={{uri: item.image_url}} />}
      </EventCard>
    );
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container>
      <EventList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <DetailsModal bottomSheetModalRef={bottomSheetModalRef} item={item} />
    </Container>
  );
}
