from flask import Flask, jsonify, render_template, request
import numpy as np
import pandas as pd
import sklearn as sk
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn.model_selection import train_test_split

app = Flask(__name__)

model=pickle.load(open('model.pkl','rb'))

@app.route('/')
def root():
    return "render_template('index.html')"

import json
import numpy as np

@app.route('/predict', methods=['GET','POST'])
def predict():
    df = pd.read_csv('deceptive-opinion.csv')
    df1 = df[['deceptive', 'text']]
    df1.loc[df1['deceptive'] == 'deceptive', 'deceptive'] = 0
    df1.loc[df1['deceptive'] == 'truthful', 'deceptive'] = 1
    X = df1['text']
    Y = np.asarray(df1['deceptive'], dtype = int)
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.3,random_state=109)
    cv = CountVectorizer()
    x = cv.fit_transform(X_train)
    y = cv.transform(X_test)
    message = request.form.get('enteredinfo')
    data = ['hii this is a good hotel very very good']
    vect = cv.transform(data).toarray()
    pred = model.predict(vect)

    print(pred)


# Example NumPy integer (int32)
    numpy_int = np.int32(pred[0])   

    # Convert NumPy integer to Python integer
    python_int = int(numpy_int)

    # Now you can serialize the object to JSON
    rk="goodd"
    if numpy_int==0:
        rk="This review is not fake"
    else:
        rk="This review is fake"
    json_data = json.dumps({"prediction": rk})

    # Print or use the JSON data as needed
    print(json_data)
    return json_data
    #return render_template('result.html', prediction_text=pred)
    #return [pred[0]]

    
if __name__ == '__main__':
    app.run(debug=True)