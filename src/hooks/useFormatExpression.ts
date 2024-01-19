import { useEffect, useState } from "react";

import { FormatExpressionParams } from "../models/formatExpressionParams";

import { EXPRESSIONS } from "../constants/common";

// TODO: Set expressions type
const useFormatExpression = (expressions: any) => {
  const [expressionMessage, setExpressionMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleExpressionMessage = (options: FormatExpressionParams) => {
      const { name, value } = options;
      const percentageProbability = Math.floor(value * 100);

      switch (name) {
        case EXPRESSIONS.angry.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.angry.ua}, як собака бєшана 😅`
          );
          break;
        case EXPRESSIONS.disgusted.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже тобі щось ${EXPRESSIONS.disgusted.ua}, не кривися, воно не смердить 😉`
          );
          break;
        case EXPRESSIONS.fearful.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.fearful.ua}, не сци, солдат дітей не чіпає 😊`
          );
          break;
        case EXPRESSIONS.happy.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.happy.ua}. Шо ти либишся? 😁`
          );
          break;
        case EXPRESSIONS.neutral.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.neutral.ua}. Що опять не так? 🤦`
          );
          break;
        case EXPRESSIONS.sad.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.sad.ua}. Не переймайся, все буде пучком! 😘`
          );
          break;
        case EXPRESSIONS.surprised.eng:
          setExpressionMessage(
            `Із вірогідністю ${percentageProbability}%, схоже ти ${EXPRESSIONS.surprised.ua}. Питається чого? 🤷`
          );
          break;
        default:
          console.log(`Sorry, we are out of ${name}.`);
      }
    };

    // TODO: Set expressions type
    const handleFaceExpression = (expressions: any) => {
      let maxValue = Number.MIN_VALUE;
      let maxKey = "";

      for (let key in expressions) {
        if (expressions[key] < 1 && expressions[key] > maxValue) {
          maxValue = expressions[key];
          maxKey = key;

          handleExpressionMessage({ name: maxKey, value: maxValue });
        }
      }
    };

    if (expressions) {
      handleFaceExpression(expressions);
    }
  }, [expressions]);

  return { expressionMessage };
};

export default useFormatExpression;
