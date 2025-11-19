# Introduction

The idea behind this folder is to be a repository of machine learning scripts (all these files could very well be in SageMaker Studio, but they are stored here for educational purposes only). Here I will describe a little about the purpose of the projects, installation, and some improvements (since I didn't have much time).

## Projects

freight_pricing.py = Machine Learning model to predict freight values based on shipping data.

## Dataset

Dataset source: https://www.kaggle.com/datasets/enzoschini/brazilian-e-commerce-public-dataset-by-olist

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```
## Improviments

According to CRISP-DM best practices, one of the first steps is data modeling, followed by data preparation... I simply skipped those steps and separated some features off the top of my head because I only needed to do a proof of concept, but I'll leave here some key points about what I would do if I had more time.

- First, I would carefully examine all the columns and, before anything else, clean them if necessary. Checking for null values ​​is important, and then make a decision: either remove the rows with null columns or fill them with the median value of the column to avoid impacting the probabilities. Both solutions should be analyzed in detail to determine the best approach. Remember that these columns may not even be very important, which leads to the second point:

- Create a correlation matrix. We already know the target variable; now I need to know the correlation between the other columns to generate an analysis from this. Perhaps merging features to create a more powerful feature would solve our problem. In a correlation matrix, I'm looking for features close to 1 or -1, which indicate a strong correlation with the target variable.

- Ensure that my columns are numeric. The models don't handle text very well; I need to standardize them to numbers and then keep them on the same standard scale (sklearn.preprocessing.StandardScaler).

- Now let's move on to choosing the... Different models will yield different performances. Remember that the challenge in freight_pricing.py, for example, is a regression problem, so we expect to achieve a good R² score; this is the ultimate goal (but of course, we need to ensure we're not overfitting or underfitting).

Simply choosing the best model isn't enough; we need to analyze the hyperparameters of each model. Therefore, we need to divide our dataset into training, validation, and testing sets. The validation data is precisely for adjusting the hyperparameters until we reach a confident value.

As you can see, there are several paths, and each path generates new insights. For this, we need to generate several experiments until we arrive at a final model. The objective of this document was mainly to show the theoretical basis so that my interviewer feels more confident in understanding the reasons behind certain decisions and where we can go from there.