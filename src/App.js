import React, { useState } from "react";
import Chat, {
  Bubble,
  useMessages,
  FileCard,
  List,
  ListItem
} from "@chatui/core";
import "@chatui/core/dist/index.css";
import ChatGPT from "./ChatGPT.png";

const initialMessages = [
  {
    type: "text",
    content: { text: "Upload your file, we will summarize it for you." },
    user: {
      avatar: ChatGPT
    }
  }
  // {
  //   type: "image",
  //   content: {
  //     picUrl: "//img.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png"
  //   }
  // }
];
const defaultQuickReplies = [
  {
    name: "reset"
    // isHighlight: true
  },
  {
    name: "clear"
  }
];

const toolbar = [
  {
    type: "image", // 类型
    icon: "image", // 图标（svg），与下面的 img 二选一即可
    img: "", // 图片（img），推荐用 56x56 的图，会覆盖 icon
    title: "Image" // 名称
  },
  {
    type: "file", // 类型
    icon: "file", // 图标（svg），与下面的 img 二选一即可
    title: "File" // 名称
  }
];
export default function App() {
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(false);
  const { messages, appendMsg, setTyping, resetList } = useMessages(
    initialMessages
  );

  // a helper function to append a message
  function appendMsgList(text) {
    // substring from Questions:
    let summary = text.substring(0, text.indexOf("\n"));
    let questions = text.substring(text.indexOf("\n:"));
    appendMsg({
      type: "text",
      content: {
        text: summary
      },
      avatar: ChatGPT
    });
    // Iterate over questions and get each question
    let questionsArray = questions.split("\n");
    questionsArray.shift();
    let list = [];

    // Iterate over questions and print each question
    for (let i = 0; i < questionsArray.length; i++) {
      list.push(questionsArray[i]);
    }
    // appendMsg({
    //   type: "text",
    //   content: {
    //     text: "Other questions you may be interested in:"
    //   },
    //   avatar: ChatGPT
    // });
    appendMsg({
      type: "list",
      content: {
        list
      },
      avatar: ChatGPT
    });

    setQuickRepliesVisible(true);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;
    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case "file":
        return <FileCard file={content.file} />;
      case "list":
        return (
          <List bordered={true}>
            {content.list.map((item) => (
              <ListItem
                key={item}
                content={item}
                onClick={function () {
                  handleSend("text", item);
                  // appendMsg({
                  //   type: "text",
                  //   content: { text: item },
                  //   position: "right"
                  // });
                }}
              />
            ))}
          </List>
        );
      default:
        return null;
    }
  }

  function handleQuickReplyClick(item) {
    handleSend("text", item.name);
  }

  // Only apply to toolbar event
  function handleToolbarClick(item, ctx) {
    // console.log(item, ctx);
    if (item.type === "image") {
      const file = document.createElement("input");
      file.setAttribute("accept", "image/*");
      file.type = "file";
      file.click();
      file.onchange = function () {
        console.log(file.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        reader.onload = function (e) {
          // console.log(e.target.result);
          appendMsg({
            type: "image",
            content: {
              picUrl: reader.result
            },
            position: "right"
          });
        };

        const formData = new FormData();
        // Append the file
        formData.append("image", file.files[0]);
      };
    } else if (item.type === "file") {
      // console.log(item, ctx);
      /** 上传文件 */
      // 调用原生 input[type=file] 上传文件
      const file = document.createElement("input");
      file.setAttribute("accept", ".text,.pdf,.docx");
      file.type = "file";
      file.multiple = true;
      file.click();
      // 触发 onchange 事件
      file.onchange = function () {
        appendMsg({
          type: "file",
          content: {
            file: file.files[0]
          },
          position: "right"
        });

        const formData = new FormData();
        // Append the files
        for (let i = 0; i < file.files.length; i++) {
          formData.append("file", file.files[i]);
        }
        
        // request for upload
        fetch('http://localhost:8000/file', {
        fetch('http://localhost:8000/pdf', {
          method: 'POST',
          body: formData,
        }).then(res => res.json())
          .then(data => {
            appendMsgList(data.message.content)
          })
          .catch((err) => {
            console.log(err);
          })

        // Mock responses from Apis
        // let text =
        //   "Summary: The text provides instructions for using Conda, a platform for managing packages and environments in Python. It includes commands for verifying and updating Conda, creating and managing environments, exporting and importing environments, and installing packages. The text also mentions Anaconda Navigator, a graphical user interface for managing Conda. Finally, it provides additional resources for support and training.\n\nQuestions:\n1. What is Conda?\n2. What are some of the commands for managing environments in Conda?\n3. What is Anaconda Navigator?\n4. What are some additional resources for support and training related to Conda?\n5. How can you update all packages within an environment using Conda?";
        // appendMsgList(text);
      };
    }
  }

  // Only apply to the input event
  function handleSend(type, val) {
    console.log(type, val);
    /*
      The first 3 conditions are for the normal message
      The last condition is for the fallback message
    */
    if (type === "text" && val.trim()) {
      if (val === "reset") {
        window.location.reload();
      } else if (val === "clear") {
        resetList();
        // } else if (val === "Questions 1") {
      } else {
        // Predefined & open-ended questions
        appendMsg({
          type: "text",
          content: { text: val },
          position: "right"
        });

        setTyping(true);

        // request for chat
        fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: val
          }),
        }).then(res => res.json())
          .then(data => {
            appendMsg({
              type: "text",
              content: { text: data.message.content.trim()},
              user: {
                avatar: ChatGPT
              }
            });
            setQuickRepliesVisible(true);
          })
          .catch((err) => {
            console.log(err);
          })
        // Mock responses from Apis
        // setTimeout(() => {
        //   appendMsg({
        //     type: "text",
        //     content: { text: "Bala bala" },
        //     user: {
        //       avatar: ChatGPT
        //     }
        //   });
        // }, 1000);
      }
    }
  }

  return (
    <Chat
      // navbar={{ title: "智能助理" }}
      placeholder={""}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      quickRepliesVisible={quickRepliesVisible}
      onQuickReplyClick={handleQuickReplyClick}
      toolbar={toolbar}
      onToolbarClick={handleToolbarClick}
      onSend={handleSend}
      locale="en-US"
    />
  );
}
