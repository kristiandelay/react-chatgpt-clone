import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";


import { useSelector, useDispatch } from 'react-redux';
import { fetchChats } from '../../redux/chatSlice';

function AllChats() {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state?.chats?.chats);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <ul className="chat-history-list">
      {chats?.map((chat) => (
        <li key={chat._id}>
          <Link to={`/chat/${chat._id}`}>
            <FontAwesomeIcon icon={faMessage} /> {chat.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default AllChats;