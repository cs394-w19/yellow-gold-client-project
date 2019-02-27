import React from "react";
import {
  ScrollView,
  StyleSheet,
  Button,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";

import Colors from "../constants/Colors";

import QuizProgressBar from "../components/Quiz/QuizProgressBar";
import QuizStatement from "../components/Quiz/QuizStatement";
import QuizQuestion from "../components/Quiz/QuizQuestion";
import QuizButtons from "../components/Quiz/QuizButtons";

export default class QuizScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: null,
      quizProgress: 0,
      score: 0,
      submitted: false,
      explanation: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    //const { params = {} } = navigation.state;
    return {
      //title: "Quiz",
      tabBarVisible: false,
      headerStyle: {
        height: 71,
        backgroundColor: Colors.header
      },
      headerLeft: (
        <TouchableOpacity
        onPress={() => navigation.navigate("Levels")}
        >
          <Image
            source={require('../assets/images/logos/CrushIt_LogoV2small.png')}
          />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    let quiz_data = require("../assets/quiz_data.json").quizzes;
    let quiz = quiz_data.find(q => {
      return q.quizName === "Credit Card Debt";
    });
    this.setState({
      quiz: quiz
    });

    this.props.navigation.setParams({
      quiz: this.state.quiz
    });
  }

  isAnswerCorrect(answerText) {
    let currQuestion = this.state.quiz.questions[this.state.quizProgress];
    let choice = currQuestion.answerChoices.find(choice => {
      return answerText === choice.answerText;
    });
    return choice.isCorrect;
  }

  nextQuestion() {
    if (this.state.quizProgress+1 >= this.state.quiz.questions.length) {
      // presumably also need metrics for each question
      this.props.navigation.navigate("Results", {
        score: this.state.score,
        maxScore: this.state.quiz.questions.length,
      });
      this.setState({
        quizProgress: 0,
        score: 0,
        submitted: false,
        explanation: false,
      });
    }
    else {
      this.setState({
        quizProgress: this.state.quizProgress + 1,
        submitted: false,
        explanation: false,
      });
    }
  }

  handleScoring(answerText) {
    let answerCorrect = this.isAnswerCorrect(answerText);
    let newScore = answerCorrect ? this.state.score + 1 : this.state.score;
    this.setState({ score: newScore });
  }

  handleAnswerButtonPress(answerText) {
    let answerCorrect = this.isAnswerCorrect(answerText);
    this.handleScoring(answerText);
    this.setState({
      submitted: answerText,
    });
    setTimeout(() => { this.setState({
      explanation: true
    }) }, 500);
  }

  render() {
    if (!this.state.quiz) return <Text />;

    let image = null;
    switch (10*this.state.quizProgress + this.state.explanation) {
      case 0:
        image = require('../assets/images/credit-card-debt/question0.png');
        break;
      case 1:
        image = require('../assets/images/credit-card-debt/explanation0.png');
        break;
      case 10:
        image = require('../assets/images/credit-card-debt/question1.png');
        break;
      case 11:
        image = require('../assets/images/credit-card-debt/explanation1.png');
        break;
      case 20:
        image = require('../assets/images/credit-card-debt/question2.png');
        break;
      case 21:
        image = require('../assets/images/credit-card-debt/explanation2.png');
        break;
      default:
        break;
    }

    return (
      <View style={styles.quizContainer}>
        <QuizProgressBar
          quizProgress={this.state.quizProgress}
          length={this.state.quiz.questions.length}
        />
      <ScrollView contentContainerStyle={{flex: 1}} showsVerticalScrollIndicator>
        <QuizStatement
          quiz={this.state.quiz}
          question={this.state.quizProgress}
          explanation={this.state.explanation}
          nextQuestion={() => this.nextQuestion()}
        />
        <QuizQuestion
          quiz={this.state.quiz}
          question={this.state.quizProgress}
          source={image}
          style={styles.image}

        />
        <QuizButtons
          quiz={this.state.quiz}
          quizProgress={this.state.quizProgress}
          submitted={this.state.submitted}
          explanation={this.state.explanation}
          handleAnswerButtonPress={(text) => this.handleAnswerButtonPress(text)}
          isAnswerCorrect={(answerText) => this.isAnswerCorrect(answerText)}
          nextQuestion={() => this.nextQuestion()}
         />
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    height: "100%"
  },
  imageContainer: {
    position: "absolute",
    top: "55%",
    padding: "1%",
    height: "30%"
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  }
});
