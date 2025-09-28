import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from "fs";
import path from "path";

async function crawlDetail(url: string): Promise<void> {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);

    const infor = $('.flex.flex-col.gap-2.p-4.bg-\\[var\\(--Gray-04\\)\\].rounded-xl.border.border-\\[var\\(--Primary-03\\)\\]');
    const ration = infor.find('strong').first().text();
    const time = infor.find('strong').eq(1).text();
    const level = infor.find('strong').eq(2).text();
    const infor_nutrition = infor.find('strong').last().text();

    const body_title = $('.flex.flex-col.gap-4.lg\\:gap-8.col-span-1.lg\\:col-span-2');
    const title = body_title.find('.title').text();
    const img_from_data_attr = $('div[data-img]').attr('data-img') || '';

    const block_ingredient = $('#section-nguyenlieu #tab-muong ul li');
    let list_block = '';
    block_ingredient.each((i, el) => {
      list_block += `- ${$(el).text().trim()}\n`;
    });

    const preparation = $('#section-soche div').text();
    const doing = $('#section-thuchien div').text();
    const use = $('#section-howtouse p').text();
    const tips = $('#section-tips').first().text();
    const tip_table = $('#section-tips').children().eq(2).html() || '';

    const should = $('.detail_main .flex.flex-col.gap-4').last().find('.ewa-rteLine')
      .map((i, el) => `${$(el).text().trim()}`)
      .get()
      .join('\n');
    const recipe = {
      title,
      img_from_data_attr,
      list_block,
      preparation,
      doing,
      use,
      tips,
      tip_table,
      should,
      ration,
      time,
      level,
      infor_nutrition,
    };
    // Convert sang JSON string
    const recipeJson = JSON.stringify(recipe, null, 2);

    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const filePath = path.join(exportDir, "recipe.json");
    fs.writeFileSync(filePath, recipeJson, "utf-8");

  } catch (error) {
    console.error(`Lỗi khi crawl chi tiết: ${error}`);
  }
}

async function crawl(): Promise<void> {
  for (let i = 0; i < 198; i++) {
    const url = `https://monngonmoingay.com/tim-kiem-mon-ngon/page/${i + 1}/`;

    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(res.data);
    const listItem = $('.group-3').find('.flex-recipe');

    for (let j = 0; j < listItem.length; j++) {
      const element = listItem[j];
      const urlDetail = $(element).find('a').first().attr('href');
      if (urlDetail) {
        console.log(`Crawl link ${i + 1}: ${urlDetail}`);
        await crawlDetail(urlDetail);
        return;

      }
    }
    return;

  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

crawl();