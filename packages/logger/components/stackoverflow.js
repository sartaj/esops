import axios from 'axios'

const TopAnswerFromQuestionId = id =>
  `https://api.stackexchange.com/2.2/questions/32800066/answers?page=1&pagesize=1&order=asc&sort=activity&site=stackoverflow&filter=!9Z(-wzftf`

export const stackoverflow = async id =>
  axios
    .get(TopAnswerFromQuestionId(id))
    .then(response => response.data.items[0].body_markdown)
    .then(md => {
      return md
    })
    .catch(e => {
      console.warn(`Can't connect to stackoverflow`, e)
      return ''
    })
