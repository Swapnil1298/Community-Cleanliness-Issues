import { Router } from 'express';
import Contribution from '../models/Contribution.js';

const router = Router();

const toContributionResponse = (doc) => {
  const obj = doc.toObject();
  return {
    id: obj._id.toString(),
    ...obj,
    _id: undefined,
    __v: undefined,
  };
};

router.post('/', async (req, res) => {
  try {
    const contribution = await Contribution.create(req.body);
    res.status(201).json(toContributionResponse(contribution));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const contributions = await Contribution.find({ email: req.params.email }).sort({
      createdAt: -1,
    });
    res.json(contributions.map(toContributionResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/issue/:issueId', async (req, res) => {
  try {
    const contributions = await Contribution.find({ issueId: req.params.issueId }).sort({
      createdAt: -1,
    });
    res.json(contributions.map(toContributionResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
