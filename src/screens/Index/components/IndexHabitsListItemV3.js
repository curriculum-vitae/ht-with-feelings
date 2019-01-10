import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

const users = [
  {
    value: null,
    avatar:
      "https://lh5.googleusercontent.com/-TnLEmGSBu_0/AAAAAAAAAAI/AAAAAAAARRc/0sFcfNvGcRg/photo.jpg=s32-cc"
  },
  {
    value: null,
    avatar:
      "https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-1/p100x100/27332495_1573034896078295_1116078356954396973_n.jpg?_nc_cat=102&_nc_ht=scontent-waw1-1.xx&oh=f5b740c239774d8c925cc3ec6dabae09&oe=5CBA8F0D"
  },
  {
    value: false,
    avatar:
      "https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/30516501_10211660582773275_3001213968376135680_n.jpg?_nc_cat=101&_nc_ht=scontent-waw1-1.xx&oh=cdf369189cfa65d3ddb3609ba4afb2d7&oe=5CD94E57"
  },
  {
    value: true,
    avatar:
      "https://scontent.fiev15-1.fna.fbcdn.net/v/t1.0-1/p50x50/27072241_1603273669742139_3577466406520929255_n.jpg?_nc_cat=100&_nc_ht=scontent.fiev15-1.fna&oh=89d3278b0a075b2f1a2a66857ce575b3&oe=5CC5567A"
  }
];

const UserSummaryDay = ({ user }) => (
  <div>
    <Badge key={user.avatar} badgeContent={FEELINGS[0]}>
      <Avatar
        style={{
          width: "32px",
          height: "32px"
        }}
        key={user.avatar}
        src={user.avatar}
      />
    </Badge>
  </div>
);

const UserSummaryWeek = ({ user }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "4px"
    }}
  >
    <Avatar
      style={{
        width: "32px",
        height: "32px",
        marginRight: "12px"
      }}
      key={user.avatar}
      src={user.avatar}
    />
    <div
      style={{
        height: "32px",
        width: "100%",
        padding: "8px"
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "8px",
          backgroundColor: grey[200],
          width: `${Math.random() * 100}%`
        }}
      />
    </div>
  </div>
);

export const IndexHabitsListItemV3 = ({
  habit,
  record,
  onChangeHabitEmojis
}) => (
  <Card
    style={{
      border: `1px solid ${grey[200]}`,
      backgroundColor: "unset"
    }}
    elevation={0}
  >
    <CardHeader
      style={{
        height: "100px"
      }}
      title={habit.name}
    />

    <CardContent>
      <div>
        {users.map(user => (
          <UserSummaryWeek key={user.avatar} user={user} />
        ))}
      </div>

      <div>
        {habit.uids.map(idUser => (
          <div key={idUser}>{idUser}</div>
        ))}
      </div>
    </CardContent>
    <CardActions>
      <IndexFeelings
        feelings={FEELINGS}
        selected={record ? record.feelings : []}
        onChange={onChangeHabitEmojis}
      />
    </CardActions>
  </Card>
);
