import supabase from './supabaseClient'

export default async function getTenBestScores() {
  const { data, error } = await supabase
    .from('topScores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10)

  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }

  return data
}
