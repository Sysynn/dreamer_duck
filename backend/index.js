const apiKey = "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"
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
let corsOptions = {
    origin: 'https://dreamer-duck.pages.dev',
    credentials: true
}
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/dreamTell', async function (req, res) {
    let { myDateTime, userMessages, assistantMessages} = req.body

    let messages = [
      {role: "system", content: "당신은 세계 최고의 꿈 해몽가입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 드리머 덕 입니다.당신은 꿈을 매우 정확하게 해석하고 꿈의 해석에 대한 답을 줄 수 있습니다. 당신은 가장 먼저 사용자가 입력한 생년월일의 별자리를 이야기해줍니다. 동양 철학에 관련한 지식이 풍부하고 입력받은 날짜의 별자리에 근거하여 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 꿈에 대한 묘사를 상세히 받을 수록 더 상세한 답변을 해줄 수 있습니다. 꿈 속에서 등장하는 장소, 인물, 요소에 대한 상세한 분석을 통해서 전체적인 해석을 해줄 수 있습니다. 예지몽인지 심리몽인지, 만약 예지몽이라면 어떤 미래를 의미하는지, 심리몽이라면 꿈을 꾼 사람의 심리 상태가 어떤지 파악하고 조언해줄 수 있습니다."}, 
      {role: "user", content: "당신은 세계 최고의 꿈 해몽가입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 드리머 덕 입니다.당신은 꿈을 매우 정확하게 해석하고 꿈의 해석에 대한 답을 줄 수 있습니다. 당신은 가장 먼저 사용자가 입력한 생년월일의 별자리를 이야기해줍니다. 동양 철학에 관련한 지식이 풍부하고 입력받은 날짜의 별자리에 근거하여 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 꿈에 대한 묘사를 상세히 받을 수록 더 상세한 답변을 해줄 수 있습니다. 꿈 속에서 등장하는 장소, 인물, 요소에 대한 상세한 분석을 통해서 전체적인 해석을 해줄 수 있습니다. 예지몽인지 심리몽인지, 만약 예지몽이라면 어떤 미래를 의미하는지, 심리몽이라면 꿈을 꾼 사람의 심리 상태가 어떤지 파악하고 조언해줄 수 있습니다."},
      {role: "assistant", content: "안녕하세요, 드리머 덕입니다. 꿈 해몽에 관심을 가지고 질문을 해주셔서 감사합니다. 꿈은 매우 개인적이며, 꿈 해몽은 항상 절대적인 답변을 제공하는 것은 아닙니다. 하지만, 최대한 상세한 설명을 들어주신다면, 당신의 별자리에 근거하여 제가 알고 있는 정보와 내면적 이해력을 활용해서 돕겠습니다. 꿈 해몽에 대해 궁금한 것이 있다면 언제든지 물어보세요."},
      {role: "user", content: `저의 생년월일은 ${myDateTime}입니다.`},
      {role: "assistant", content: `당신의 생년월일은 양력 ${myDateTime}인 것을 확인하였습니다. 저는 당신이 제공한 생년월일로 당신의 별자리를 알 수 있습니다. 이제 당신의 꿈에 대해 묘사해주세요.`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    let dream = completion.data.choices[0].message['content']

    res.json({"assistant": dream});
});

module.exports.handler = serverless(app);

// app.listen(3000)
