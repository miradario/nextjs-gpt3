import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/guru2.png'

import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'

export default function Home() {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();
    const topic = formData.get("topic")?.toString().trim() || '{}';


    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/guru?prompt=" + encodeURIComponent(prompt) +  "&topic=" + encodeURIComponent(topic)); 
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  }

  return (
    <>
     <Head>
        <title>Guru AI</title>
        <meta name="description" content="Guru Openai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
<video autoPlay muted loop className={styles.video}>         
          <source src='./assets/video/onlyguru.mp4' type="video/mp4"/>       
      </video>

      <main className={styles.main}>
      
       <Image src={mainImage} alt='Guru' width={100} height={30} />
       
      
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <h1 className='mb-3'>Ask GurudevAI</h1>
          <Form.Group className='mb-3' controlId='prompt-input'>
            
            {/* select a topic */}
            <Form.Label>Whats topic do you want to talk...</Form.Label>
            <Form.Control as='select' name='topic'>
              <option value=''>Select a topic</option>
              <option value='health'>Health</option>
              <option value='Relantionship'>Relantionship</option>
              <option value='Money'>Money</option>
              <option value='About the guru'>About me</option>
              <option value=''>Miscellaneous</option>
            </Form.Control>
            <br />
            <Form.Label>Enter a question to the guru...</Form.Label>
            <Form.Control
              name='prompt'
              placeholder='e.g. How to live my life better?'
              maxLength={100}
            />
          </Form.Group>
          <Button type='submit' className='mb-3' disabled={quoteLoading}>
            Ask Gurudev
          </Button>
        </Form>
        {quoteLoading && <Spinner animation='border' />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  )
}
