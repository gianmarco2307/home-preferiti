import React, { ChangeEvent, Fragment, useState } from "react";
import "./App.css";
import { Card } from "./interfaces/card";
import { utilitySetItem, utilityFormFieldsValidation } from "./utilities";
import styled from "styled-components";

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
  flexFlow: 'row wrap'
}));

const Favorite = styled.div(() => ({
  cursor: "pointer",
}));

function App() {
  // variabili localStorage
  const cachedCards = localStorage.getItem("cards");

  // variabili di stato
  const [isHome, setHome] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>(
    !!cachedCards ? JSON.parse(cachedCards) : []
  );

  // variabili di controllo forms
  const [title, setTitle] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [isImgValid, setImgValid] = useState<boolean>(false);

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
          isFavorite: false,
        },
      ];
      setCards(newCards);
      utilitySetItem(newCards);
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
    const newCards: Card[] = [...cards];
    newCards[index] = {
      ...cards[index],
      isFavorite: true,
    };
    setCards(newCards);
    utilitySetItem(newCards);
  }

  function onClickRemoveFavorite(index: number) {
    const newCards: Card[] = [...cards];
    newCards[index] = {
      ...cards[index],
      isFavorite: false,
    };
    setCards(newCards);
    utilitySetItem(newCards);
  }

  // componenti
  function PrintCard(card: Card, index: number): JSX.Element | null {
    if (isHome) {
      return (
        <DivCard key={index}>
          <ImgCard src={card.img}></ImgCard>
          <TitleCard>{card.title}</TitleCard>
          <Favorite>
            {card.isFavorite ? (
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
      if (card.isFavorite) {
        return (
          <DivCard key={index}>
            <ImgCard src={card.img}></ImgCard>
            <TitleCard>{card.title}</TitleCard>
            <Favorite>
              <span className="material-symbols-outlined" onClick={() => onClickRemoveFavorite(index)}>heart_minus</span>
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
        <button onClick={onClickHomePage}>Home</button>
        <button onClick={onClickPreferitiPage}>Preferiti</button>
      </header>
      {isHome ? (
        <Fragment>
          <form>
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
            <button onClick={onClickCreateCard} disabled={formNotValid()}>
              Crea
            </button>
          </form>
          <Home />
        </Fragment>
      ) : (
        <Preferiti />
      )}
    </>
  );
}

export default App;
