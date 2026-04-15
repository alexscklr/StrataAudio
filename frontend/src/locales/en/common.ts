import enBase from './base';
import enPages from './pages';
import enSurveys from './surveys';

const en = {
    ...enBase,
    ...enPages,
    surveys: enSurveys,
};

export default en;
