import React, { ChangeEvent, Fragment, useState } from "react";
import "./App.css";
import { Card } from "./interfaces/card";
import {
  utilitySetItem,
  utilityFormFieldsValidation,
  utilityEmailValidation,
} from "./utilities";
import styled from "styled-components";
import { Users } from "./interfaces/users";

const FormLogin = styled.form(() => ({
  fontSize: "16px",
  width: "16em",
  margin: "auto",
  textAlign: "center",
  border: "0.07em solid black",
  marginTop: "2em",
  borderRadius: "1em"
}))

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
  marginTop: "0.7em"
}))

const Add = Login;

const DivCard = styled.div(() => ({
  height: "25em",
  width: "15em",
  fontSize: "16px",
  border: "0.1em solid black",
  borderRadius: "1.5em",
  margin: "2em",
  textAlign: "center",
}));

const TitleCard = styled.p(() => ({
  height: "3em",
  width: "96%",
  marginLeft: "auto",
  marginRight: "auto",
  fontFamily: "Georgia, serif",
  fontSize: "16px",
  fontWeight: "800",
}));

const ImgCard = styled.img(() => ({
  width: "100%",
  borderRadius: "1.5em 1.5em 0 0",
}));

const DivContainer = styled.div(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexFlow: "row wrap",
}));

const Favorite = styled.div(() => ({
  cursor: "pointer",
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

  // variabili di controllo forms
  const [title, setTitle] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [isImgValid, setImgValid] = useState<boolean>(false);
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

  function formNotValid() {
    if (isTitleValid && isImgValid) {
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
        },
      ];
      setCards(newCards);
      utilitySetItem(newCards, "cards");
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
    if(!!users[inputEmail]){
      const newFavorites: Card[] = [...users[inputEmail].favorites];
      newFavorites.push(cards[index]);
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          favorites: newFavorites
        }
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      console.error('User non trovato');
    }
  }

  function onClickRemoveFavorite(index: number) {
    if(!!users[inputEmail]){
      const newFavorites: Card[] = [...users[inputEmail].favorites];
      const indexToRemove = newFavorites.findIndex((el) => {
        return el.title == cards[index].title;
      })
      newFavorites.splice(indexToRemove, 1);
      const newUsers = {
        ...users,
        [inputEmail]: {
          ...users[inputEmail],
          favorites: newFavorites
        }
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
    } else {
      console.error('User non trovato');
    }
  }

  function onClickLogout() {
    const confermaUscita = () => {
      const conferma = window.confirm("Sei sicuro di voler uscire?");
      return conferma;
    }

    if(confermaUscita()){
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
          favorites: []
        },
      };
      setUsers(newUsers);
      utilitySetItem(newUsers, "users");
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

  // componenti
  function PrintCard(card: Card, index: number): JSX.Element | null {
    if (isHome) {
      return (
        <DivCard key={index}>
          <ImgCard src={card.img}></ImgCard>
          <TitleCard>{card.title}</TitleCard>
          <p>{card.author}</p>
          <Favorite>
            {users[inputEmail] && users[inputEmail].favorites.includes(card) ? (
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
          </Favorite>
        </DivCard>
      );
    } else {
      if (users[inputEmail] && users[inputEmail].favorites.includes(card)) {
        return (
          <DivCard key={index}>
            <ImgCard src={card.img}></ImgCard>
            <TitleCard>{card.title}</TitleCard>
            <p>{card.author}</p>
            <Favorite>
              <span
                className="material-symbols-outlined"
                onClick={() => onClickRemoveFavorite(index)}
              >
                heart_minus
              </span>
            </Favorite>
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

    </>
  );
}

export default App;
