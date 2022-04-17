module.exports = {
  sender: [
    {
      type: "file",
      path: "output.html",
    },

    {
      type: "email",
      host: "mail.waynegong.cn",
      port: 465,
      secure: true,
      auth: {
        user: "rssmailer@waynegong.cn",
        pass: "******",
      },
      subject: "RSSMailer 每日推送",
      from: "RSSMailer <RSSMailer@waynegong.cn>",
      to: "me@waynegong.cn",
    },
  ],

  filter: [
    {
      type: "fresh",
      fresh: 2 * 24 * 60 * 60 * 1000, // 2 days
    },
  ],

  feeds: [
    "https://waynegong.cn/atom.xml",
    "https://rsshub.app/gov/zhengce/zuixin",
    "https://rsshub.app/gov/zhengce/wenjian",
    "https://www.ruanyifeng.com/blog/atom.xml",
    "https://geekplux.com/feed.xml",
    "http://weiwuhui.com/feed",
    "https://www.changhai.org/feed.xml",
    "https://hutusi.com/feed.xml",
    "https://greatdk.com/rss",
    "https://waynegong.cn/atom.xml",
    "https://rsshub.app/infzm/2",
    "https://weekly.75.team/rss",
    "https://rsshub.app/36kr/news/latest",
    "https://rsshub.app/bilibili/user/video/49246269",
    "https://rsshub.app/zhihu/daily",
    "https://rsshub.app/pornhub/model/hongkongdoll",
    "https://v2ex.com/feed/tab/creative.xml",
    "http://www.waerfa.com/feed",
    "https://rsshub.app/verge",
    "https://sspai.com/feed",
    "http://datastori.es/feed/",
    "http://www.dataists.com/feed/",
    "http://datakind.org/feed/",
    "http://feeds.feedburner.com/FellInLoveWithData",
    "http://blog.stephenwolfram.com/feed/",
    "http://datafanr.com/feed",
    "https://rsshub.app/1point3acres/post/hot",
    "http://feeds.feedburner.com/addyosmani",
    "http://tianchunbinghe.blog.163.com/rss/",
    "http://rauchg.com/essays/feed/",
    "https://rauchg.com/atom",
    "http://blog.jeswang.org/atom.xml",
    "http://yujiangshui.com/atom.xml",
    "http://blog.daimajia.com/feed/",
    "https://rsshub.app/scmp/3",
    "https://rsshub.app/scmp/4",
    "https://rsshub.app/scmp/2",
    "http://s5s5.me/feed",
    "http://blog.leafsoar.com/atom.xml",
    "https://blog.youxu.info/feed.xml",
    "http://cuitianyi.com/feed/",
    "https://aifreedom.com/feed",
    "http://staltz.com/feed.xml",
    "https://byvoid.com/zht/feed.xml",
    "http://bindog.github.io/feed.xml",
    "http://blog.binux.me/atom.xml",
    "https://changkun.de/blog/index.xml",
    "https://ctian.livejournal.com/data/rss",
    "http://feeds.feedburner.com/codinghorror/",
    "https://danwang.co/feed/",
    "http://feeds.feedburner.com/daniel-lemire/atom",
    "https://egoist.sh/atom.xml",
    "http://blog.evanyou.me/atom.xml",
    "http://feeds.feedburner.com/ExceptionNotFound",
    "http://blog.pluskid.org/?feed=rss2",
    "http://freemind.pluskid.org/rss.xml",
    "https://funnyjs.com/feed/",
    "https://geelaw.blog/rss.xml",
    "https://geekplux.com/feed.xml",
    "https://geekplux.me/feed.xml",
    "https://halfrost.com/rss/",
    "https://diygod.me/atom.xml",
    "http://feeds2.feedburner.com/virushuo",
    "https://jacklew.is/feed.xml",
    "https://www.imququ.com/rss.html",
    "http://jlord.us/rss.xml",
    "https://jvns.ca/atom.xml",
    "http://feeds.lepture.com/lepture",
    "http://www.justzht.com/rss/",
    "http://gettingbit.com/feed/",
    "http://www.laurencegellert.com/feed/",
    "https://leerob.io/feed.xml",
    "https://limboy.me/index.xml",
    "https://2010-2021.limboy.me/index.xml",
    "http://linroid.com/atom.xml",
    "http://zh.lucida.me/atom.xml",
    "http://martinfowler.com/bliki/bliki.atom",
    "http://www.matrix67.com/blog/feed",
    "http://matt.might.net/articles/feed.rss",
    "http://meditic.com/feed/",
    "https://michaelfeathers.silvrback.com/feed",
    "http://bost.ocks.org/mike/index.rss",
    "https://ncase.me/feed.xml",
    "https://nosleepjavascript.com/rss.xml",
    "https://onevcat.com/feed.xml",
    "https://openmetric.org/atom.xml",
    "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    "https://rsshub.app/blogs/paulgraham",
    "http://perfectionkills.com/feed.xml",
    "http://feeds.feedburner.com/philipwalton",
    "http://blog.phoenixlzx.com/atom.xml",
    "http://feeds.feedburner.com/Pixel-In-Gene",
    "https://lutaonan.com/rss.xml",
    "http://chloerei.com/feed.xml",
    "https://www.eugenewei.com/blog?format=rss",
    "http://feeds.feedburner.com/robertnyman",
    "http://feeds.feedburner.com/ScottHanselman",
    "https://shud.in/feed.xml",
    "http://www.slyar.com/blog/feed",
    "http://feeds.feedburner.com/xdite/smalltalk",
    "https://snook.ca/jonathan/index.rdf",
    "https://sophiebits.com/atom.xml",
    "https://medium.com/feed/@mbostock",
    "http://neugierig.org/software/blog/atom.xml",
    "https://www.soimort.org/feed.atom",
    "http://wuzhiwei.net/feed/",
    "http://tonybai.com/feed/",
    "https://blog.tychio.net/atom.xml",
    "https://www.maartenlambrechts.com/feed.xml",
    "https://waitbutwhy.com/feed",
    "https://wzyboy.im/feed.xml",
    "https://xkcd.com/rss.xml",
    "https://xuanwo.io/index.xml",
    "http://yanyiwu.com/rss.xml",
    "http://yihui.name/en/feed/",
    "https://www.yuexunjiang.me/rss.xml",
    "http://zihua.li/feed",
    "http://blog.itgonglun.com/feed/",
    "http://blog.codingnow.com/atom.xml",
    "http://mindhacks.cn/feed/",
    "http://feeds.feedburner.com/bfishadow",
    "http://www.geekonomics10000.com/feed",
    "http://barretlee.com/rss2.xml",
    "https://www.zhangxinxu.com/wordpress/feed/",
    "https://techsingular.net/feed/",
    "http://yihui.name/cn/feed/",
    "http://blog.farmostwood.net/feed",
    "http://huacnlee.com/blog/rss",
    "http://blog.wangjunyu.net/feed",
    "https://jysperm.me/atom.xml",
    "https://www.leavesongs.com/feed/",
    "http://feeds2.feedburner.com/programthink",
    "http://blog.linjunhalida.com/atom.xml",
    "http://luolei.org/feed/",
    "http://blog.zhaojie.me/rss",
    "https://xcoder.in/atom.xml",
    "http://xiaohanyu.me/atom.xml",
    "http://www.zhuangbiaowei.com/blog/?feed=rss2",
    "http://coolshell.cn/feed",
    "http://feeds.feedburner.com/ruanyifeng",
    "https://www.yangzhiping.com/feed.xml",
    "https://draveness.me/feed.xml",
    "http://www.laruence.com/feed",
    "http://gaocegege.com/Blog/rss.xml",
    "http://www.storytellingwithdata.com/feeds/posts/default",
    "http://butdoesitfloat.com/rss",
    "http://chartporn.org/feed/",
    "http://feeds.feedburner.com/DailyInfographic",
    "http://www.datavizdoneright.com/feeds/posts/default",
    "http://www.guardian.co.uk/news/datablog/rss",
    "http://feeds.feedburner.com/Datavisualization",
    "http://eagereyes.org/rss.xml",
    "https://www.eagereyes.org/feed",
    "http://feeds.feedburner.com/FlowingData",
    "http://www.gapminder.org/feed/",
    "http://page2rss.com/rss/9fc3ae12a1465446684506f7461b9129",
    "http://hurlbutvisuals.com/blog/feed/",
    "http://ilovecharts.tumblr.com/rss",
    "http://feeds.feedburner.com/CoolInfographics",
    "http://infographicsnews.blogspot.com/feeds/posts/default",
    "http://infosthetics.com/atom.xml",
    "http://feeds.feedburner.com/InformationIsBeautiful",
    "http://www.infovis-wiki.net/index.php?title=Special:Newsfeed&amp;feed=rss",
    "http://feeds.feedburner.com/JuiceAnalytics",
    "http://lackarzhao.ivyb.org/?feed=rss2",
    "http://www.linesandcolors.com/feed/",
    "http://vis.pku.edu.cn/blog/?feed=rss2",
    "http://www.cad.zju.edu.cn/home/vagblog/?feed=rss2",
    "https://tamaramunzner.wordpress.com/feed/",
    "http://www.perceptualedge.com/blog/?feed=rss2",
    "https://feeds.feedburner.com/visualcapitalist",
    "http://visual.ly/rss.xml",
    "http://feeds.feedburner.com/visualcomplexity",
    "http://www.visualisingdata.com/index.php/feed/",
    "http://visualmente.blogspot.com/feeds/posts/default",
    "http://datavis.tumblr.com/rss",
    "http://www.tableausoftware.com/blog/feed",
    "http://www.vizinsight.com/feed/",
    "https://addyosmani.com/rss.xml",
    "https://christianheilmann.com/feed/",
    "https://overreacted.io/rss.xml",
    "https://davidwalsh.name/feed",
    "https://humanwhocodes.com/feeds/blog.xml",
    "http://jrsinclair.com/index.rss",
    "http://feeds.feedburner.com/JohnResig",
    "https://feeds.feedburner.com/paul-irish",
    "http://nicolasgallagher.com/category/code/feed/",
    "https://rsshub.app/allpoetry/newest",
    "http://www.zreading.cn/feed",
    "http://www.fengtang.com/blog/?feed=rss2",
    "http://www.duxieren.com/duxieren.xml",
    "http://blog.sina.com.cn/rss/twocold.xml",
    "http://csdl.computer.org/rss/tvcg.xml",
    "http://www.sciencemag.org/rss/current.xml",
    "http://www.economist.com/rss/science_and_technology_rss.xml",
    "http://www.economist.com/feeds/print-sections/77729/china.xml",
    "http://www.economist.com/rss/the_world_this_week_rss.xml",
    "http://www.nbweekly.com/rss/smw/",
    "http://hanhanone.sinaapp.com/feed/dajia",
    "http://cnpolitics.org/feed/",
  ],
};
