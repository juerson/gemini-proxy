# gemini-proxy

绕过 Google AI API 区域限制：Cloudflare Durable Object 代理方案

### 使用步骤：

1、部署到 cloudflare workers

2、由于 `workers.dev` 域名在国内无法使用，需要绑定一个干净域名（ `workers.dev` 开启本地代理也能使用的）

3、使用诸如 [Cherry Studio](https://github.com/CherryHQ/cherry-studio) 等AI客户端

在**设置** -> **模型服务** -> **Gemini** -> 填写如下：

**API密钥：** <这里添加你google api key> （https://aistudio.google.com/apikey）

**API地址：** https://您绑定的域名，比如：https://mydomain.com （注意后面没有`/`和其它字符）


在后面 **管理** 添加你要的模型，然后点 **API密钥** 旁边的 **检测** ，出现 **连接成功** 提示表示可以使用了（模型可以在 **管理** 那里拉取出现，说明链接是通的）。

