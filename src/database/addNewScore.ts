import supabase from './supabaseClient'
export default async function addNewScore(score: number, username: string) {
  // write top score to supabase
  const { error } = await supabase.from('topScores').insert({ username, score })
  if (error) {
    console.log(error)
  }
}
