import supabase from './supabaseClient'

export default async function getTopScores() {
  const { data, error } = await supabase.from('topScores').select('*').eq('username', 'test')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }

  return data
}
