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
  const [image, setImage] = useState("");

  function handleAgain() {
    setQuote("");
    setImage("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // replace ?%! with empty string from prompt
    const prompt = formData.get("prompt")?.toString().trim().replace(/[?%!]/g, '');

    
    const topic = formData.get("topic")?.toString().trim() || '{}';


    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/guru?prompt=" + encodeURIComponent(prompt) +  "&topic=" + encodeURIComponent(topic)); 
        const body = await response.json();
        console.log (body);
        setQuote(body.quote);
        setImage (body.image_url)
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

      <main className={styles.main} style={{
      backgroundImage: `url(${image})`,
      width: '100%',
      height: '60%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      
    }}
>
      <a href='https://gurudevelopers.dev/'>
       <Image src={mainImage} alt='Guru' width={200} height={60} />
       </a>
       {!quote
          ? (
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <h1 className='mb-3'> GuruGPT  </h1>
          <Form.Group className='mb-3' controlId='prompt-input'>
            
            {/* select a topic */}
            <Form.Label>What topic do you want to talk about?(opcional)</Form.Label>
            <Form.Control as='select' name='topic'>
              <option value=''>Select a topic</option>
              <option value='health'>Health</option>
              <option value='Relantionship'>Relantionship</option>
              <option value='Money'>Money</option>
              <option value='Money'>Work</option>
              <option value='About the guru'>About the Guru</option>
              <option value=''>Miscellaneous</option>
            </Form.Control>
            <br />
            <Form.Label>Enter a question to the guru...(english or spanish)</Form.Label>
            <Form.Control
              name='prompt'
              placeholder='e.g. How to live my life better? o Como vivir mejor mi vida?'
              maxLength={100}
            />
          </Form.Group>
           <br />
          <Button type='submit' className='mb-3' disabled={quoteLoading}>
            Ask Gurudev
          </Button>
        </Form>
          ) : ( null )}

        {quoteLoading && <Spinner animation='border' />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {/* image  */}
       
        
        {quote &&  
        <div className={styles.quote}>
          <h5>{quote}</h5>
        
          </div>
      }
        

      </main>
       {quote ?  
      <Button  onClick={handleAgain} className={styles.ask} disabled={quoteLoading}>
            Ask Again
          </Button>  
          : null
        }
          
   
  
   </>
)
}
