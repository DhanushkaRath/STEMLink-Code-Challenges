import express from 'express';

export const initializeMiddleware = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}; 