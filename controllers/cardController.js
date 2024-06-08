import HttpError from '../helpers/HttpError.js';
import { Card } from '../model/tasksList.js';

export const addCard = async (req, res, next) => {
  const { title, description, columnId } = req.body;
  const { priority } = req.params;
  try {
    const cardInfo = {
      title,
      description,
      priority,
      deadline: null,
      columnId,
    };

    const newCard = await Card.create(cardInfo);

    res.status(200).send(newCard);
  } catch (error) {
    next(error);
  }
};

export const getAllCards = async (req, res, next) => {
  const { columnId } = req.body;

  if (!columnId) {
    throw HttpError(404);
  }

  try {
    const allCards = await Card.find({ columnId });

    res.status(200).send(allCards);
  } catch (error) {
    next(error);
  }
};

export const getOneCard = async (req, res, next) => {
  const { cardId } = req.params;

  if (!cardId) {
    throw HttpError(404);
  }

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw HttpError(404);
    }

    res.status(200).send(card);
  } catch (error) {
    next(error);
  }
};

export const editCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { columnId } = req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw HttpError(404);
    }

    if (card.columnId.toString() !== columnId.toString()) {
      throw HttpError(400, 'Card does not belong to the specified column');
    }

    const result = await Card.findByIdAndUpdate(cardId, req.body, {
      new: true,
    });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { columnId } = req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw HttpError(404);
    }

    if (card.columnId.toString() !== columnId.toString()) {
      throw HttpError(400, 'Card does not belong to the specified column');
    }

    const result = await Card.findByIdAndDelete({ _id: cardId });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
