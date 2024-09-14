import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useUser} from '../../../store/user/hook.ts';
import {Linking} from 'react-native';

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

const fetchData = async (creator: string) => {
  const response = await fetch(
    `http://localhost:3000/event/queryEventByCreator?creator=${creator}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.json();
};

export function MyEventsScreen() {
  const user = useUser();
  const creator = user.address;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData(creator);
      if (!data || JSON.stringify(result) !== JSON.stringify(data)) {
        setData(result.res);
      }
    };
    getData();
  }, [creator]);

  const handlePress = (hash: string) => {
    Linking.openURL(`https://sepolia.arbiscan.io/tx/${hash}`);
  };

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
            <Row key={index} onPress={() => handlePress(item.hash)}>
              <Column flex={1}>
                <DataText>{item.name}</DataText>
              </Column>
              <Column flex={1.5}>
                <DataText>{item.uid}</DataText>
              </Column>
              <Column flex={1}>
                {item.remained_ticket === 0 ? (
                  <DataText color={'red'} weight="bold">
                    Over
                  </DataText>
                ) : (
                  <DataText color={'green'} weight="bold">
                    In Progress
                  </DataText>
                )}
              </Column>
            </Row>
          ))}
      </ScrollList>
    </Container>
  );
}
