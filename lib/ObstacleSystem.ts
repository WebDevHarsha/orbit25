import { Dimensions } from 'react-native'
import Obstacle from '../components/Obstacle'

const { width, height } = Dimensions.get('window')

// Collision detection helper function
export const checkCollision = (
  entity1: any,
  entity2: any,
  radius1: number,
  radius2: number
) => {
  const [x1, y1] = entity1.position
  const [x2, y2] = entity2.position

  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  return distance < radius1 + radius2
}

// Obstacle spawning and management system
export const ObstacleSystem = (entities: any, { time }: any) => {
  const deltaTime = time.delta / 1000

  // Spawn new obstacles randomly
  if (!entities.obstacleSpawnTimer) {
    entities.obstacleSpawnTimer = 0
  }

  entities.obstacleSpawnTimer += deltaTime

  // Spawn obstacle every 2-4 seconds
  const spawnInterval = 2 + Math.random() * 2
  if (entities.obstacleSpawnTimer >= spawnInterval) {
    entities.obstacleSpawnTimer = 0

    // Create a new obstacle
    const obstacleId = `obstacle_${Date.now()}_${Math.random()}`
    const obstacleTypes = ['asteroid', 'debris', 'crystal']
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]

    // Random size between 30-60 pixels
    const size = 30 + Math.random() * 30

    // Spawn from random edge
    const edge = Math.floor(Math.random() * 4) // 0=top, 1=right, 2=bottom, 3=left
    let startX, startY, velocityX, velocityY

    switch (edge) {
      case 0: // Top
        startX = Math.random() * width
        startY = -size
        velocityX = (Math.random() - 0.5) * 100
        velocityY = 50 + Math.random() * 50
        break
      case 1: // Right
        startX = width + size
        startY = Math.random() * height
        velocityX = -(50 + Math.random() * 50)
        velocityY = (Math.random() - 0.5) * 100
        break
      case 2: // Bottom
        startX = Math.random() * width
        startY = height + size
        velocityX = (Math.random() - 0.5) * 100
        velocityY = -(50 + Math.random() * 50)
        break
      case 3: // Left
        startX = -size
        startY = Math.random() * height
        velocityX = 50 + Math.random() * 50
        velocityY = (Math.random() - 0.5) * 100
        break
    }

    entities[obstacleId] = {
      position: [startX, startY],
      velocity: { x: velocityX, y: velocityY },
      size: { width: size, height: size },
      type: type,
      renderer: Obstacle,
    }
  }

  // Move existing obstacles and check for cleanup
  Object.keys(entities).forEach((key) => {
    if (key.startsWith('obstacle_')) {
      const obstacle = entities[key]
      const [x, y] = obstacle.position

      // Move obstacle
      obstacle.position = [
        x + obstacle.velocity.x * deltaTime,
        y + obstacle.velocity.y * deltaTime,
      ]

      // Remove obstacles that are off-screen
      const margin = 100
      const [newX, newY] = obstacle.position
      if (
        newX < -margin ||
        newX > width + margin ||
        newY < -margin ||
        newY > height + margin
      ) {
        delete entities[key]
      }
    }
  })

  return entities
}

// Collision detection system
export const CollisionSystem = (entities: any) => {
  if (!entities.player) return entities

  const playerRadius = 24 // Half of player size (48/2)

  // Check collisions with obstacles
  Object.keys(entities).forEach((key) => {
    if (key.startsWith('obstacle_')) {
      const obstacle = entities[key]
      const obstacleRadius = obstacle.size.width / 2

      if (
        checkCollision(entities.player, obstacle, playerRadius, obstacleRadius)
      ) {
        // Handle collision - bounce the player away
        const [playerX, playerY] = entities.player.position
        const [obstacleX, obstacleY] = obstacle.position

        // Calculate collision direction
        const dirX = playerX - obstacleX
        const dirY = playerY - obstacleY
        const distance = Math.sqrt(dirX * dirX + dirY * dirY)

        if (distance > 0) {
          // Normalize direction
          const normalX = dirX / distance
          const normalY = dirY / distance

          // Apply bounce force to player momentum
          const bounceForce = 200
          entities.player.momentum.x += normalX * bounceForce
          entities.player.momentum.y += normalY * bounceForce

          // Move player away from obstacle to prevent sticking
          const separationDistance = playerRadius + obstacleRadius + 5
          entities.player.position = [
            obstacleX + normalX * separationDistance,
            obstacleY + normalY * separationDistance,
          ]
        }

        // Optional: Remove obstacle on collision or make it bounce
        // delete entities[key] // Uncomment to remove obstacle on hit

        // Make obstacle bounce away
        obstacle.velocity.x += (playerX - obstacleX) * 0.5
        obstacle.velocity.y += (playerY - obstacleY) * 0.5
      }
    }
  })

  return entities
}
