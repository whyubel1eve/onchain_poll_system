import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useUser} from '../../../store/user/hook.ts';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHourglass} from '@fortawesome/free-solid-svg-icons';
import {VoteModal} from './modal/vote.modal.tsx';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {PollEvent} from '../../events/type';

interface ColumnProps {
  flex: number;
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ScrollList = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 20,
  },
}))`
  flex: 1;
  background-color: #f7f7f7;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  background-color: #fff;
  padding: 20px;
  border-bottom-width: 2px;
  border-bottom-color: #ececec;
`;

const Row = styled.TouchableOpacity`
  flex-direction: row;
  padding: 15px;
  background-color: #fff;
  margin: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Column = styled.View<ColumnProps>`
  flex: ${props => props.flex || 1};
  padding: 0 5px;
  align-items: center;
`;

const VoteText = styled.Text`
  margin-top: 20px;
  color: royalblue;
  text-decoration: underline royalblue;
  font-size: 16px;
`;

const Icon = styled.View`
  margin-top: 10px;
`;

const HeaderText = styled.Text`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

type TextProps = {
  color?: string;
  weight?: string;
};
const DataText = styled.Text<TextProps>`
  color: ${({color}) => color || '#666'};
  font-size: 14px;
  font-weight: ${({weight}) => weight || 'normal'};
`;

const fetchData = async (applicant: string) => {
  const response = await fetch(
    `http://localhost:3000/application/queryApplication?applicant=${applicant}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.json();
};

export function MyApplicationsScreen() {
  const user = useUser();
  const applicant = user.address;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [data, setData] = useState<any>(null);
  const [item, setItem] = useState<PollEvent>();

  const handlePresentPress = (item: any) => {
    setItem(item);
    // @ts-ignore
    bottomSheetModalRef.current.present();
    return;
  };

  const getData = useCallback(async () => {
    const result = await fetchData(applicant);
    if (!data || JSON.stringify(result) !== JSON.stringify(data)) {
      setData(result.res);
    }
  }, [applicant]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <ScrollList>
        <HeaderRow>
          <Column flex={1}>
            <HeaderText>Event</HeaderText>
          </Column>
          <Column flex={1.5}>
            <HeaderText>Event UID</HeaderText>
          </Column>
          <Column flex={1}>
            <HeaderText>Status</HeaderText>
          </Column>
        </HeaderRow>
        {data &&
          data.map((item: any, index: number) => (
            <Row
              key={index}
              onPress={() => {
                console.log('query event detail');
              }}>
              <Column flex={1}>
                <DataText>{item.name}</DataText>
              </Column>
              <Column flex={1.5}>
                <DataText>{item.uid}</DataText>
              </Column>
              <Column flex={1}>
                <DataText
                  color={item.status === 'approved' ? 'green' : 'royalblue'}
                  weight="bold">
                  {item.status}
                </DataText>
                {item.status === 'inProgress' && (
                  <Icon>
                    <FontAwesomeIcon
                      icon={faHourglass}
                      color={'royalblue'}
                      size={16}
                    />
                  </Icon>
                )}
                {item.status === 'approved' && (
                  <TouchableOpacity onPress={() => handlePresentPress(item)}>
                    <VoteText>vote</VoteText>
                  </TouchableOpacity>
                )}
              </Column>
            </Row>
          ))}
      </ScrollList>
      <VoteModal bottomSheetModalRef={bottomSheetModalRef} item={item} />
    </Container>
  );
}
