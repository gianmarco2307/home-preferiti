import React, { ChangeEvent, Fragment, useState } from "react";
import "./App.css";
import { Card } from "./interfaces/card";
import {
  utilitySetItem,
  utilityFormFieldsValidation,
  utilityEmailValidation,
} from "./utilities";
import styled, { css } from "styled-components";
import { Users } from "./interfaces/users";
import { Message } from "./interfaces/Message";

const FormLogin = styled.form(() => ({
  fontSize: "16px",
  width: "16em",
  margin: "auto",
  textAlign: "center",
  border: "0.07em solid black",
  marginTop: "2em",
  borderRadius: "1em",
}));

const FormAdd = FormLogin;

const Login = styled.button(() => ({
  width: "30%",
  textTransform: "uppercase",
  outline: 0,
  cursor: "pointer",
  border: "0.07em solid black",
  padding: "0.3em",
  background: "#46A15B",
  color: "white",
  filter: "brightness(0.95)",
  marginBottom: "1em",
  marginTop: "0.7em",
}));

const Add = Login;

const DivCard = styled.div(() => ({
  height: "34em",
  width: "18em",
  fontSize: "16px",
  border: "0.1em solid black",
  borderRadius: "1.5em",
  margin: "2em",
  textAlign: "center",
}));

const TitleCard = styled.p(() => ({
  height: "2em",
  width: "96%",
  marginLeft: "auto",
  marginRight: "auto",
  fontFamily: "Georgia, serif",
  fontSize: "16px",
  fontWeight: "800",
}));

const DescriptionCard = styled.p(() => ({
  height: "5em",
  width: "94%",
  marginLeft: "auto",
  marginRight: "auto",
  fontSize: "15px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "justify",
}));

const ImgCard = styled.img(() => ({
  width: "100%",
  borderRadius: "1.5em 1.5em 0 0",
}));

const AuthorCard = styled.p(() => ({
  fontSize: "14px",
}));

const DateCard = styled.p(() => ({
  fontSize: "12px",
}));

const CommentsCard = styled.a(() => ({
  margin: "auto",
  textDecoration: "none",
  color: "black",
}));

const FavoriteCard = CommentsCard;

const DivContainer = styled.div(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexFlow: "row wrap",
}));

const BottomSection = styled.div(() => ({
  display: "flex",
  justifyContent: "space-around",
}));

const DivComments = styled.div<{ $myMessage?: boolean }>`
  background-color: rgb(75, 73, 73);
  color: white;
  border-radius: 20px;
  border: 2px solid;
  width: 35em;
  float: left;
  margin: 10px auto 10px auto;

  ${(props) =>
    props.$myMessage &&
    css`
      background-color: #4caf50;
      float: right;
    `}
`;

const MessageAuthor = styled.h4(() => ({
  textAlign: "left",
  marginLeft: "1.5em",
}));

const MessageContent = styled.p(() => ({
  fontSize: "18px",
  width: "90%",
  margin: "auto",
  textAlign: "left",
}));

const MessagePubDate = styled.h5(() => ({
  textAlign: "right",
  marginRight: "1.5em",
}));

const MessageDelete = styled.button(() => ({
  fontSize: "16px",
  border: "0.07em solid red",
  color: "red",
  background: "transparent",
  cursor: "pointer",
  float: "right",
  marginRight: "1.5em",
  marginBottom: "1em",
  opacity: "0.8",
}));

const DivChat = styled.div(() => ({
  width: "75%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
}));

function App() {
  // variabili localStorage
  const cachedCards = localStorage.getItem("cards");
  const cachedEmail = localStorage.getItem("email");
  const cachedUsersString = localStorage.getItem("users");
  const cachedUsers: Users = !!cachedUsersString
    ? JSON.parse(cachedUsersString)
    : {};

  // variabili di stato
  const [isHome, setHome] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>(
    !!cachedCards ? JSON.parse(cachedCards) : []
  );
  const [isLogged, setIsLogged] = useState<boolean>(!!cachedEmail);
  const [inputEmail, setInputEmail] = useState<string>(
    !!cachedEmail ? cachedEmail : ""
  );
  const [users, setUsers] = useState<Users>(cachedUsers);
  const [favorites, setFavorites] = useState<string[]>(
    !!users[inputEmail] ? users[inputEmail].favorites : []
  );
  const [showComments, setShowComments] = useState<boolean>(false);
  const [CardToShow, setCardToShow] = useState<Card | null>(null);
  const [message, setMessage] = useState<string>("");

  // variabili di controllo forms
  const [title, setTitle] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [isImgValid, setImgValid] = useState<boolean>(false);
  const [isDescriptionValid, setDescriptionValid] = useState<boolean>(false);
  const [isEmailValid, setEmailValid] = useState<boolean>(false);

  // funzioni
  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    if (utilityFormFieldsValidation(event.target.value)) {
      setTitleValid(true);
    } else {
      setTitleValid(false);
    }
    setTitle(event.target.value);
  }

  function onChangeImg(event: ChangeEvent<HTMLInputElement>) {
    if (utilityFormFieldsValidation(event.target.value)) {
      setImgValid(true);
    } else {
      setImgValid(false);
    }
    setImg(event.target.value);
  }

  function onChangeDescription(event: ChangeEvent<HTMLInputElement>) {
    if (utilityFormFieldsValidation(event.target.value)) {
      setDescriptionValid(true);
    } else {
      setDescriptionValid(false);
    }
    setDescription(event.target.value);
  }

  function formNotValid() {
    if (isTitleValid && isImgValid && isDescriptionValid) {
      return false;
    }
    return true;
  }

  function onClickCreateCard() {
    const cardFound = cards.find((card: Card) => {
      return card.title === title;
    });
    if (!!cardFound) {
      window.alert("Card già esistente");
    } else {
      const newCards: Card[] = [
        ...cards,
        {
          title: title,
          img: img,
          author: inputEmail,
          date: new Date().toLocaleString(),
          description: description,
          comments: [],
        },
      ];
      setCards(newCards);
      utilitySetItem(newCards, "cards");
      setTitle("");
      setImg("");
      setDescription("");
    }
  }

  function onClickHomePage() {
    if (isHome === true) {
      console.log("sei già in home");
    } else {
      setHome(!isHome);
    }
  }

  function onClickPreferitiPage() {
    if (isHome === false) {
      console.log("sei già nei preferiti");
    } else {
      setHome(!isHome);
    }
  }

  function onClickAddFavorite(index: number) {
    if (!!users[inputEmail]) {
      const newFavorites: string[] = [...users[inputEmail].favorites];
      newFavorites.push(cards[index].title);
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          favorites: newFavorites,
        },
      };
      setFavorites(newFavorites);
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      console.error("User non trovato");
    }
  }

  function onClickRemoveFavorite(index: number) {
    if (!!users[inputEmail]) {
      const newFavorites: string[] = [...users[inputEmail].favorites];
      const indexToRemove = newFavorites.findIndex((el) => {
        return el === cards[index].title;
      });
      newFavorites.splice(indexToRemove, 1);
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          favorites: newFavorites,
        },
      };
      setFavorites(newFavorites);
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      console.error("User non trovato");
    }
  }

  function onClickLogout() {
    const confermaUscita = () => {
      const conferma = window.confirm("Sei sicuro di voler uscire?");
      return conferma;
    };

    if (confermaUscita()) {
      setFavorites([]);
      setIsLogged(false);
      setEmailValid(false);
      localStorage.removeItem("email");
      setInputEmail("");
    }
  }

  function onClickLogin() {
    setIsLogged(true);
    utilitySetItem(inputEmail);
    if (!users[inputEmail]) {
      const newUsers = {
        ...users,
        [inputEmail]: {
          favorites: [],
        },
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      setFavorites(users[inputEmail].favorites);
    }
  }

  function onChangeEmail(event: any) {
    if (utilityEmailValidation(event.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
    setInputEmail(event.target.value);
  }

  function showCommentsSection(index: number) {
    if (showComments === true) {
      setCardToShow(cards[index]);
    } else {
      setShowComments(true);
      setCardToShow(cards[index]);
    }
  }

  function closeCommentsSection() {
    setShowComments(false);
    setCardToShow(null);
  }

  function onChangeMessage(event: ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  function createMessage() {
    if (!!CardToShow && !!CardToShow.comments) {
      const newComments: Message[] = [
        ...CardToShow.comments,
        {
          author: inputEmail,
          date: new Date().toLocaleString(),
          content: message,
        },
      ];
      const newCard: Card = {
        ...CardToShow,
        comments: newComments,
      };
      const newCards: Card[] = cards.map((card) =>
        card.title === CardToShow.title ? newCard : card
      );
      setCards(newCards);
      utilitySetItem(newCards, "cards");
      setMessage("");
    } else {
      console.error("Errore");
    }
  }

  function deleteMsg(index: number) {
    if (!!CardToShow && !!CardToShow.comments) {
      const newComments: Message[] = [...CardToShow.comments];
      newComments.splice(index, 1);
      const newCard: Card = {
        ...CardToShow,
        comments: newComments,
      };
      const newCards: Card[] = cards.map((card) =>
        card.title === CardToShow.title ? newCard : card
      );
      setCards(newCards);
      utilitySetItem(newCards, "cards");
    } else {
      console.error("Errore");
    }
  }

  // componenti
  function PrintMessage(msg: Message, index: number): JSX.Element {
    if (msg.author == inputEmail) {
      return (
        <DivComments key={index} $myMessage>
          <MessageAuthor>{msg.author} (TU)</MessageAuthor>
          <MessageContent>{msg.content}</MessageContent>
          <MessagePubDate>{msg.date}</MessagePubDate>
          <MessageDelete onClick={() => deleteMsg(index)}>
            Elimina
          </MessageDelete>
        </DivComments>
      );
    }
    return (
      <DivComments key={index}>
        <MessageAuthor>{msg.author}</MessageAuthor>
        <MessageContent>{msg.content}</MessageContent>
        <MessagePubDate>{msg.date}</MessagePubDate>
      </DivComments>
    );
  }

  function PrintCard(card: Card, index: number): JSX.Element | null {
    if (isHome) {
      return (
        <DivCard key={index}>
          <ImgCard src={card.img}></ImgCard>
          <TitleCard>{card.title}</TitleCard>
          <DescriptionCard>{card.description}</DescriptionCard>
          <AuthorCard>{card.author}</AuthorCard>
          <DateCard>{card.date}</DateCard>
          <BottomSection>
            <FavoriteCard>
              {favorites.length >= 1 && favorites.includes(card.title) ? (
                <span
                  className="material-symbols-outlined"
                  id="favorite"
                  onClick={onClickPreferitiPage}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => onClickAddFavorite(index)}
                >
                  heart_plus
                </span>
              )}
            </FavoriteCard>
            <CommentsCard
              onClick={() => showCommentsSection(index)}
              href="#comments"
            >
              <span className="material-symbols-outlined">chat</span>
            </CommentsCard>
          </BottomSection>
        </DivCard>
      );
    } else {
      if (favorites.includes(card.title)) {
        return (
          <DivCard key={index}>
            <ImgCard src={card.img}></ImgCard>
            <TitleCard>{card.title}</TitleCard>
            <DescriptionCard>{card.description}</DescriptionCard>
            <AuthorCard>{card.author}</AuthorCard>
            <DateCard>{card.date}</DateCard>
            <BottomSection>
              <span
                className="material-symbols-outlined"
                onClick={() => onClickRemoveFavorite(index)}
              >
                heart_minus
              </span>
            </BottomSection>
          </DivCard>
        );
      }
    }
    return null;
  }

  function Home(): JSX.Element {
    return (
      <>
        <DivContainer>{cards.map(PrintCard)}</DivContainer>
      </>
    );
  }

  function Preferiti(): JSX.Element {
    return (
      <>
        <DivContainer>{cards.map(PrintCard)}</DivContainer>
      </>
    );
  }

  return (
    <>
      <header>
        <button onClick={onClickHomePage} disabled={!isLogged}>
          Home
        </button>
        <button onClick={onClickPreferitiPage} disabled={!isLogged}>
          Preferiti
        </button>
        <button onClick={onClickLogout} id="logout" disabled={!isLogged}>
          Logout
        </button>
      </header>
      {isLogged ? (
        isHome ? (
          <Fragment>
            <FormAdd>
              <input
                placeholder="Titolo"
                value={title}
                onChange={onChangeTitle}
              />
              <input
                placeholder="Descrizione"
                value={description}
                onChange={onChangeDescription}
              />
              <input
                placeholder="Url dell'immagine"
                value={img}
                onChange={onChangeImg}
              />
              <Add onClick={onClickCreateCard} disabled={formNotValid()}>
                Crea
              </Add>
            </FormAdd>
            <Home />
          </Fragment>
        ) : (
          <Preferiti />
        )
      ) : (
        <FormLogin>
          <input
            placeholder="Inserisci email"
            value={inputEmail}
            onChange={onChangeEmail}
          />
          <Login onClick={onClickLogin} disabled={!isEmailValid} id="login">
            Login
          </Login>
        </FormLogin>
      )}
      {!!showComments ? (
        <Fragment>
          <h2 id="comments">Commenti</h2>
          <span className="material-symbols-outlined" onClick={closeCommentsSection}>close</span>
          <form>
            <input
              placeholder="Nuovo messaggio"
              value={message}
              onChange={onChangeMessage}
            />
            <button onClick={createMessage} disabled={!message}>
              Invia
            </button>
          </form>
          {!!CardToShow ? (
            <DivChat>
              {!!CardToShow.comments ? (
                CardToShow.comments.map((msg, index) =>
                  PrintMessage(msg, index)
                )
              ) : (
                <></>
              )}
            </DivChat>
          ) : (
            <></>
          )}
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
    </>
  );
}

export default App;
