import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input, MenuButton, Skeleton } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";

function App() {
  const [threads, setThreads] = useState([]);
  const [conv, setConv] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");

  const user_id = "4344699602";

  useEffect(() => {
    const fetchThreads = async () => {
      const threads = await axios.get("http://localhost:4000/threads");
      setThreads(threads.data);
      await getThread(threads.data[0].thread_id, 0);
      setIsLoaded(true);
    };

    fetchThreads();
  }, []);

  // setTimeout(async () => {
  //   if (index > 0 && index < threads.length) {
  //     console.log("getting thread");
  //     await getThread(threads[index].thread_id, index);
  //   }
  // }, 5000);

  const getThread = async (thread_id, index) => {
    setIndex(index);
    setIsLoaded(false);
    const conv = await axios.post(`http://localhost:4000/conv`, { thread_id });
    setConv(conv.data.reverse());
    setIsLoaded(true);
  };

  const sendMessage = async () => {
    setInput("");
    const thread_id = threads[index].thread_id;
    await axios.post(`http://localhost:4000/send`, {
      thread_id,
      message: input,
    });
    await getThread(thread_id, index);
  };
  return (
    <div className="App">
      <header className="App-header">
        <Skeleton isLoaded={isLoaded} style={{ width: "100%" }}>
          <Tabs
            index={index}
            onChange={async (index) => {
              if (index > 0 && index < threads.length)
                await getThread(threads[index].thread_id, index);
            }}
          >
            <TabList>
              {threads.map((thread) => (
                <Tab>{thread.thread_title}</Tab>
              ))}
            </TabList>
            (
            <Tab>
              <div
                style={{
                  display: "flex",
                  flexFlow: "column",
                  width: "800px",
                  background: "aliceBlue",
                  padding: "6px",
                }}
              >
                <div>Messages: </div>
                {conv.map((c) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        c.user_id != user_id ? "flex-start" : "flex-end",
                      margin: "4px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "300px",
                        background: "white",
                        boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
                        padding: "0.4em 0.8em",
                        margin: "0.2em",
                        borderRadius: "0.4em",
                      }}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
                <Input
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  style={{ background: "white", marginBottom: "0.4em" }}
                ></Input>
                <Button onClick={sendMessage} colorScheme="teal">
                  Send
                </Button>
              </div>
            </Tab>
            )
          </Tabs>
        </Skeleton>
      </header>
    </div>
  );
}

export default App;
