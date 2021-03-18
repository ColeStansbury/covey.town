import React, {useEffect, useState} from 'react';
import assert from "assert";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import useVideoContext from '../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext';
import Video from '../../classes/Video/Video';
import {CoveyTownInfo, TownJoinResponse,} from '../../classes/TownsServiceClient';
import useCoveyAppState from '../../hooks/useCoveyAppState';

interface TownSelectionProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
}

export default function TownSelection({doLogin}: TownSelectionProps): JSX.Element {
  const [userName, setUserName] = useState<string>(Video.instance()?.userName || '');
  const [townIdInput, setTownIdInput] = useState<string>('');
  const [towns, setTowns] = useState<CoveyTownInfo[]>();
  const [newTownIsPublic, setNewTownIsPublic] = useState<boolean>(true);
  const [newTownName, setNewTownName] = useState<string>('');
  const {connect} = useVideoContext();
  const {apiClient} = useCoveyAppState();
  const toast = useToast();

  useEffect(() => {
      const getTowns = async () => apiClient.listTowns()
        .then(res => setTowns(res.towns.sort((a, b) =>
          b.currentOccupancy - a.currentOccupancy)));
      getTowns().then(r => r);
      const interval = setInterval(() => getTowns(), 2000);
      return () => clearInterval(interval);
    },
    [apiClient]);

  /**
   * A method to validate a given property and return true that it is valid or notify the client
   * and return false that it is invalid.
   * @param value The string to validate
   * @param errorTitle The error message for the toast to be displayed to the client
   * @param errorDescription The error description for the toast to be displayed to the client
   * @returns isValid true if valid, otherwise false, indicating the client was notified with a
   *          toast message
   */
  const validateStringOrNotifyClient =
    (value?: string, errorTitle = 'Something went wrong',
     errorDescription = 'Please try again.'): boolean => {
      if (!value || value.length === 0) {
        toast({
          title: errorTitle,
          description: errorDescription,
          status: 'error',
        });
        return false;
      }
      return true;
    }
  /**
   * A helper method to join a town based on it's ID
   * @param townIdToJoin a valid town id
   * @param roomUserName a valid userName to identify the user in the room
   * @throws Error if the video setup, login or connection fails
   */
  const joinRoom = async (roomUserName: string, townIdToJoin: string) => {
    const initData = await Video.setup(roomUserName, townIdToJoin);
    const loggedIn = await doLogin(initData);
    if (loggedIn) {
      assert(initData.providerVideoToken);
      await connect(initData.providerVideoToken);
    }
  }


  const handleJoin = async (townIdToJoin = townIdInput) => {
    try {
      if (validateStringOrNotifyClient(
        userName, 'Unable to join town', 'Please select a username')
        && validateStringOrNotifyClient(
          townIdToJoin, 'Unable to join town', 'Please enter a town ID')) {
        await joinRoom(userName, townIdToJoin);
      }
    } catch
      (err) {
      validateStringOrNotifyClient(undefined,
        'Unable to connect to Towns Service', err.toString());
    }
  }

  const handleCreateTown = async () => {
    try {
      if (validateStringOrNotifyClient(userName, 'Unable to create town',
        'Please select a username before creating a town')
        && validateStringOrNotifyClient(newTownName, 'Unable to create town',
          'Please enter a town name')) {
        const createData = await apiClient.createTown(
          {friendlyName: newTownName, isPubliclyListed: newTownIsPublic});
        toast({
          title: `Town ${newTownName} is ready to go!`,
          description:
            `Secret Password: ${createData.coveyTownPassword}, Town ID: ${createData.coveyTownID}`,
          status: "success",
          duration: null,
          isClosable: true,
        });
        await joinRoom(userName, createData.coveyTownID);
      }
    } catch (err) {
      validateStringOrNotifyClient(undefined,
        'Unable to connect to Towns Service', err.toString());
    }
  }

  return (
    <>
      <form>
        <Stack>
          <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg">Select a username</Heading>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input autoFocus name="name" placeholder="Your name"
                     value={userName}
                     onChange={event => setUserName(event.target.value)}
              />
            </FormControl>
          </Box>
          <Box borderWidth="1px" borderRadius="lg">
            <Heading p="4" as="h2" size="lg">Create a New Town</Heading>
            <Flex p="4">
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="townName">New Town Name</FormLabel>
                  <Input name="townName" placeholder="New Town Name"
                         value={newTownName}
                         onChange={(e) => setNewTownName(e.target.value)}
                  />
                </FormControl>
              </Box><Box>
              <FormControl>
                <FormLabel htmlFor="isPublic">Publicly Listed</FormLabel>
                <Checkbox isChecked={newTownIsPublic}
                          onChange={() => setNewTownIsPublic(!newTownIsPublic)}
                          id="isPublic" name="isPublic"/>
              </FormControl>
            </Box>
              <Box>
                <Button data-testid="newTownButton"
                        onClick={handleCreateTown}>Create</Button>
              </Box>
            </Flex>
          </Box>
          <Heading p="4" as="h2" size="lg">-or-</Heading>

          <Box borderWidth="1px" borderRadius="lg">
            <Heading p="4" as="h2" size="lg">Join an Existing Town</Heading>
            <Box borderWidth="1px" borderRadius="lg">
              <Flex p="4"><FormControl>
                <FormLabel htmlFor="townIDToJoin">Town ID</FormLabel>
                <Input value={townIdInput}
                       onChange={(e) => setTownIdInput(e.target.value)}
                       name="townIDToJoin"
                       placeholder="ID of town to join, or select from list"/>
              </FormControl>
                <Button data-testid='joinTownByIDButton'
                        onClick={() => handleJoin()}>Connect</Button>
              </Flex>
            </Box>

            <Heading p="4" as="h4" size="md">Select a public town to join</Heading>
            <Box maxH="500px" overflowY="scroll">
              <Table>
                <TableCaption placement="bottom">Publicly Listed Towns</TableCaption>
                <Thead><Tr><Th>Town Name</Th><Th>Town ID</Th><Th>Activity</Th></Tr></Thead>
                <Tbody>
                  {towns?.map(town =>
                    <Tr key={town.coveyTownID}>
                      <Td role='cell'>
                        {town.friendlyName}
                      </Td>
                      <Td role='cell'>
                        {town.coveyTownID}
                      </Td>
                      <Td role='cell'>
                        {town.currentOccupancy}/{town.maximumOccupancy}
                        <Button
                          isDisabled={town.currentOccupancy >= town.maximumOccupancy}
                          onClick={() => handleJoin(town.coveyTownID).then(r => r)}>
                          Connect
                        </Button>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Stack>
      </form>
    </>
  );
}
