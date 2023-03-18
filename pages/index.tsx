import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/guru.png'
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

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/guru?prompt=" + encodeURIComponent(prompt));
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
      <main className={styles.main}>
       <h1>Guru JGD</h1>
       <h2>by Gurudevelopers.dev</h2>
       <div>
        Enter a question and Guru Sri sri Ravi Shankar will answer it.
       </div>
       <div className={styles.mainImageContainer}>
          <Image src={mainImage} fill
          alt='Guru Sri Sri Ravi Shankar'
          priority
          
          className={styles.mainImage}
          />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className='mb-3' controlId='prompt-input'>
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
