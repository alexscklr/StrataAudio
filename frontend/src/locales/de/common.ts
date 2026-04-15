import deBase from './base';
import dePages from './pages';
import deSurveys from './surveys';

const de = {
    ...deBase,
    ...dePages,
    surveys: deSurveys,
};

export default de;
