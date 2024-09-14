import {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useUser} from '../../store/user/hook.ts';

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

const Row = styled.View`
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

type ButtonProps = {
  color?: string;
  margin_top?: number;
};
const StyledButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({color}) => color || '#666'};
  margin-top: ${({margin_top}) => (margin_top ? `${margin_top}px` : 0)};
  border-radius: 8px;
  padding: 8px;
  justify-content: center;
  align-items: center;
`;

const ButtonArea = styled.View``;

const fetchData = async (creator: string) => {
  const response = await fetch(
    `http://localhost:3000/application/queryApplicationByCreator?creator=${creator}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.json();
};

export function ApplicationScreen() {
  const user = useUser();
  const creator = user.address;

  const [data, setData] = useState<any>(null);

  const getData = useCallback(async () => {
    const result = await fetchData(creator);
    if (!data || JSON.stringify(result) !== JSON.stringify(data)) {
      setData(result.res);
    }
  }, [creator]);

  useEffect(() => {
    getData();
  }, []);

  const handleApprove = async (id: number) => {
    const response = await fetch(
      `http://localhost:3000/application/handleApplication`,
      {
        method: 'POST',
        body: JSON.stringify({
          status: 'approved',
          id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const res = await response.json();
    console.log(res);
    await getData();
  };

  const handleReject = async (id: number) => {
    await fetch(`http://localhost:3000/application/handleApplication`, {
      method: 'POST',
      body: JSON.stringify({
        status: 'rejected',
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await getData();
  };
  return (
    <Container>
      <ScrollList>
        <HeaderRow>
          <Column flex={1}>
            <HeaderText>Event</HeaderText>
          </Column>
          <Column flex={1}>
            <HeaderText>Applicant</HeaderText>
          </Column>
          <Column flex={1.5}>
            <HeaderText>Address</HeaderText>
          </Column>
          <Column flex={1.2}>
            <HeaderText>Status</HeaderText>
          </Column>
        </HeaderRow>
        {data &&
          data.map((item: any, _index: number) => {
            if (item.applicant_address === user.address) {
              return;
            } else {
              return (
                <Row key={item.id}>
                  <Column flex={1}>
                    <DataText weight={'bold'}>{item.name}</DataText>
                  </Column>
                  <Column flex={1}>
                    <DataText weight={'bold'}>{item.applicant_name}</DataText>
                  </Column>
                  <Column flex={1.5}>
                    <DataText>
                      {`${item.applicant_address.substring(
                        0,
                        6,
                      )}...${item.applicant_address.substring(
                        item.applicant_address.length - 4,
                      )}`}
                    </DataText>
                  </Column>
                  <Column flex={1.2}>
                    {item.status === 'inProgress' ? (
                      <ButtonArea>
                        <StyledButton
                          color={'green'}
                          onPress={() => handleApprove(item.id)}>
                          <DataText color={'white'} weight={'bold'}>
                            Approve
                          </DataText>
                        </StyledButton>
                        <StyledButton
                          margin_top={15}
                          color={'red'}
                          onPress={() => handleReject(item.id)}>
                          <DataText color={'white'} weight={'bold'}>
                            Reject
                          </DataText>
                        </StyledButton>
                      </ButtonArea>
                    ) : item.status === 'approved' ? (
                      <StyledButton color={'#666'}>
                        <DataText color={'white'} weight={'bold'}>
                          Approved
                        </DataText>
                      </StyledButton>
                    ) : (
                      <StyledButton color={'#666'}>
                        <DataText color={'white'} weight={'bold'}>
                          Rejected
                        </DataText>
                      </StyledButton>
                    )}
                  </Column>
                </Row>
              );
            }
          })}
      </ScrollList>
    </Container>
  );
}
