import { useEffect, useState } from "react";

import { AgeAndGenderState } from "../models/ageAndGenderState";

import { GENDER } from "../constants/common";

const useAgeAndGenderDetection = (genderAndAge: AgeAndGenderState | null) => {
  const [ageAndGenderMessage, setAgeAndGenderMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAgeAndGenderMessage = () => {
      const { gender, age } = genderAndAge as AgeAndGenderState;

      let genderMessage = "";

      switch (gender) {
        case GENDER.male.eng:
          genderMessage = `Схоже тут у нас ${GENDER.male.ua}. `;
          break;
        case GENDER.female.eng:
          genderMessage = `Схоже тут у нас ${GENDER.female.ua}. `;
          break;
        default:
          console.log(`Who is this ${gender}?`);
      }

      if (age < 10) {
        genderMessage += `О, сцикопіхота на місці! Тобі ${age} рочків.`;
      } else if (age < 20) {
        genderMessage += `Ще трішки і будуть півчик продавати. Тобі ${age} рочків.`;
      } else if (age < 30) {
        genderMessage += `Входиш у доросле життя. Тобі ${age} рочків.`;
      } else if (age < 40) {
        genderMessage += `Вже пора ставати розсудливим. Тобі ${age} рочків.`;
      } else if (age < 50) {
        genderMessage += `Як там, 45-ть баба ягідка опять. Тобі ${age} рочків.`;
      } else if (age < 60) {
        genderMessage += `Ще є порох у порохівницях. Тобі ${age} рочків.`;
      } else if (age < 70) {
        genderMessage += `В принципі, вже можна і місце спочивання підбирати. Тобі ${age} рочків.`;
      } else if (age > 70.01) {
        genderMessage += `Це вже клініка. Тобі ${age} рочків.`;
      }

      setAgeAndGenderMessage(genderMessage || "");
    };

    if (genderAndAge) {
      handleAgeAndGenderMessage();
    }
  }, [genderAndAge]);

  return { ageAndGenderMessage };
};

export default useAgeAndGenderDetection;
