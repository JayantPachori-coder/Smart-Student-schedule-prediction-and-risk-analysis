import Test from "../models/Test.js";
import Question from "../models/Question.js";

// CREATE TEST
export const createTest = async (req, res) => {
  const test = await Test.create({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user.id
  });

  res.json(test);
};

// ADD QUESTION
export const addQuestion = async (req, res) => {
  const question = await Question.create(req.body);

  await Test.findByIdAndUpdate(req.body.testId, {
    $push: { questions: question._id }
  });

  res.json(question);
};

// PUBLISH TEST
export const publishTest = async (req, res) => {
  const test = await Test.findByIdAndUpdate(
    req.body.testId,
    {
      duration: req.body.duration,
      schedule: req.body.schedule,
      settings: req.body.settings,
      status: "published"
    },
    { new: true }
  );

  res.json(test);
};

// GET ALL TESTS
export const getTests = async (req, res) => {
  const tests = await Test.find().populate("questions");
  res.json(tests);
};