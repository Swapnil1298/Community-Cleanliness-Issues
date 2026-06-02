import { Router } from 'express';
import Issue from '../models/Issue.js';

const router = Router();

const toIssueResponse = (doc) => {
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
    const issue = await Issue.create(req.body);
    res.status(201).json(toIssueResponse(issue));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues.map(toIssueResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest', async (_req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).limit(6);
    res.json(issues.map(toIssueResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const issues = await Issue.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(issues.map(toIssueResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(toIssueResponse(issue));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(toIssueResponse(issue));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
