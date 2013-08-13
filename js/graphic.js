playerList = new Array();
bulletList = new Array();

function GraphicObject() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.bodyDef = new b2BodyDef;
    this.fixDef = new b2FixtureDef;
    this.body = null;

    this.createBodyDef = function(img) {
        this.bodyDef.position.x = this.x;
        this.bodyDef.position.y = this.y;
        this.bodyDef.angle = this.angle;
        this.bodyDef.type = b2Body.b2_dynamicBody;
        var data = {
            img : img
        }
        this.bodyDef.userData = data;
    }
    this.createFixDef = function() {
        this.fixDef.density = .5;
        this.fixDef.friction = 0.1;
        this.fixDef.restitution = 0.2;
        this.fixDef.shape = new b2CircleShape(3);
    }
};
function GraphicEngine() {
    var world;
    this.init = function() {
        var gravity = new b2Vec2(0, -10);
        var doSleep = false;
        world = new b2World(gravity, doSleep);
    }
    this.clear = function() {
        ctx.clearRect(0, 0, scanvas.WIDTH, scanvas.HEIGHT);
    }

    this.drawRotatedImage = function(image, player) {
        ctx.save();
        ctx.translate(player.dx, player.dy);
        ctx.rotate(player.da * TO_RADIANS);
        ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
        ctx.restore();
    }
    this.drawShootImage = function(image, bullet) {
        ctx.save();
        ctx.translate(bullet.dx, bullet.dy);
        ctx.rotate(bullet.a * TO_RADIANS);
        ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
        ctx.restore();
    }
    this.rect = function(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    this.simulate = function() {
        z = window.setInterval(this.processObjects, (0.5));

    }

    this.processObjects = function() {
        processPlayers();
        processBullets();

        var node = world.GetBodyList();
        while (node) {
            var b = node;
            node = node.GetNext();
            var position = b.GetPosition();

            if (b.m_userData && b.m_userData.img) {
                var edge = b.GetContactList();
                while (edge) {
                    var other = edge.other;
                    if (other.GetType() == b2Body.b2_dynamicBody) {
                        var othershape = other.GetFixtureList().GetShape();
                        if (othershape.GetType() == b2Shape.e_polygonShape) {
                            world.DestroyBody(other);
                            break;
                        }
                    }
                    edge = edge.next;
                }

                var imgObj = b.m_userData.img;
                ctx.save();
                console.log(b.GetAngle());
                ctx.translate(position.x, position.y);
                ctx.rotate(b.GetAngle() * TO_RADIANS);
                ctx.drawImage(imgObj, -(imgObj.width / 2), -(imgObj.height / 2));
                ctx.restore();

            }

        }
    }
    processPlayers = function() {
        for ( var index in playerList) {
            var gPlayer = playerList[index];
            var playerBody = gPlayer.body;
            if (typeof playerBody === "undefined" || playerBody === null) {
                // console.log("null");
                gPlayer.createBodyDef(ship);
                gPlayer.createFixDef();
                var body = world.CreateBody(gPlayer.bodyDef);
                body.CreateFixture(gPlayer.fixDef);
                gPlayer.body = body;
                playerList[index] = gPlayer;
            } else {
                // console.log("not null");
                // alert(b.m_xf);
                var v = {
                    x : gPlayer.x,
                    y : gPlayer.y
                };
                playerBody.SetPosition(v);
                playerBody.SetAngle(gPlayer.angle);
                gPlayer.body = playerBody;
                playerList[index] = gPlayer;

            }
        }
    };
    processBullets = function() {
        for ( var index in bulletList) {
            var gBullet = bulletList[index];
            var bulletBody = gBullet.body;
            if (typeof bulletBody === "undefined" || bulletBody === null) {
                // console.log("null");
                gBullet.createBodyDef(bullet);
                gBullet.createFixDef();
                var body = world.CreateBody(gBullet.bodyDef);
                body.CreateFixture(gBullet.fixDef);
                gBullet.body = body;
                bulletList[index] = gBullet;
            } else {
                // console.log("not null");
                // alert(b.m_xf);
                var v = {
                    x : gBullet.x,
                    y : gBullet.y
                };
                bulletBody.SetPosition(v);
                bulletBody.SetAngle(gBullet.angle);
                gBullet.body = bulletBody;
                bulletList[index] = gBullet;

            }
        }
    };

};

