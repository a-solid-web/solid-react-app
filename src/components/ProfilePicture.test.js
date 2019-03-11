import React from "react";
import ProfilePicture from "./ProfilePicture";
import renderer from "react-test-renderer";

describe('ProfilePicture matches snapshot when', () => {
    test('no props are passed.', () => {
        const component = renderer.create(
          <ProfilePicture />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    test('props are passed', () => {
        const component = renderer.create(
          <ProfilePicture picture="/hereisanad"/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
})