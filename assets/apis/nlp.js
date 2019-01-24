export const possibleList = {
  help: {
    type: 'help',
    message: 'do you want any help?'
  },
  overview: {
    type: 'overview',
    message: 'be summary my work life'
  },
  contact: {
    type: 'contact',
    message: 'contact to website owner?'
  }
}

export const classifySentenceMessage = message => {
  const { nouns, verbs, adj, sentence } = message

  if (verbs.includes('help')) return possibleList.help
  if (verbs.includes('understand') && sentence.includes('not'))
    return possibleList.help

  if (nouns.includes('summary') || adj.includes('overview'))
    return possibleList.overview

  if (
    nouns.includes('question') ||
    verbs.includes('question') ||
    nouns.includes('contact') ||
    verbs.includes('contact')
  )
    return possibleList.contact
}
