// pages/index.tsx  ➜ cola isso se a pasta pages existir
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // redireciona já logado
  if (session) {
    return { redirect: { destination: '/ranking', permanent: false } }
  }

  return { props: {} }
}

export default function Home() {
  return (
    <main style={{display:'flex',flexDirection:'column',gap:'32px',alignItems:'center',justifyContent:'center',height:'100vh',textAlign:'center'}}>
      <h1 style={{fontSize:'32px',fontWeight:600}}>Bem-vindo(a) à MASC PRO</h1>
      <p style={{maxWidth:320,color:'#555'}}>
        Resultados previsíveis, progresso visível e comunidade unida.
      </p>
      <a href="/role-select" style={{background:'#63003c',color:'#fff',padding:'16px 32px',borderRadius:12,textDecoration:'none'}}>
        Continuar
      </a>
    </main>
  )
}