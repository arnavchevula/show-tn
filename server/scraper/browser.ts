import puppeteer, { Browser } from 'puppeteer';                                                                                                                                                               
import puppeteerCore from 'puppeteer-core';                                                                                                                                                                   
import chromium from '@sparticuz/chromium';                                                                                                                                                                   
                                                                                                                                                                                                              
export async function launchBrowser(): Promise<Browser> {                                                                                                                                                     
  const isProduction = process.env.PRODUCTION === 'true'                                                                                                                                                      
    || !!process.env.AWS_LAMBDA_FUNCTION_NAME;                                                                                                                                                                
                                                                                                                                                                                                              
  if (isProduction) {                                                                                                                                                                                         
    return await puppeteerCore.launch({                                                                                                                                                                       
      args: chromium.args,                                                                                                                                                                                    
      executablePath: await chromium.executablePath(),                                                                                                                                                        
      headless: chromium.headless,                                                                                                                                                                            
    }) as Browser;                                                                                                                                                                                            
  }                                                                                                                                                                                                           
                                                                                                                                                                                                              
  return await puppeteer.launch({                                                                                                                                                                             
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',                                                                                                                           
    headless: true,                                                                                                                                                                                           
  });                                                                                                                                                                                                         
}                                                                                                                                                                                                             
                                                                                                                                                                                                              
export async function getPageHtml(browser: Browser, url: string): Promise<string> {                                                                                                                           
  const page = await browser.newPage();
  const customUA = generateRandomUA();
  await page.setUserAgent({userAgent: customUA});                                                                                                                                                                       
  await page.goto(url, { waitUntil: 'networkidle2' });                                                                                                                                                        
  const html = await page.content();     
  return html;                                                                                                                                                                                                
}        

const generateRandomUA = () => {
  // Array of random user agents
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
  ];
  // Get a random index based on the length of the user agents array 
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  // Return a random user agent using the index above
  return userAgents[randomUAIndex];
}