//
//  ManualFocusManager.m
//  upload
//
//  Created by jagelooyadav on 20/10/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ManualFocusManager.h"
#import <SCRecorder.h>

@interface ManualFocusManager()


@end

@implementation ManualFocusManager

@synthesize bridge = _bridge;

- (NSArray<NSString *> *)supportedEvents{
  return @[@"AppendVideo", @"CheckNewSegment"];
}


RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(tapFocus:(nonnull NSNumber*)x :(nonnull NSNumber*)y)
{
  
  [[SCRecorder sharedRecorder].toolView tapAtPoint:CGPointMake(x.floatValue, y.floatValue)];
}

RCT_EXPORT_METHOD(removeFocusFeedback)
{
  
  [[SCRecorder sharedRecorder].toolView removeFocusFeedback];
}

RCT_EXPORT_METHOD(removeEvent) {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_METHOD(prepareSession:(RCTResponseSenderBlock)callback) {
  
  if ([SCRecorder sharedRecorder].session == nil) {
    
    SCRecordSession *session = [SCRecordSession recordSession];
    session.fileType = AVFileTypeQuickTimeMovie;
    
    [SCRecorder sharedRecorder].session = session;
  }
  
  NSString *dataString = @(CMTimeGetSeconds([SCRecorder sharedRecorder].session.duration)).stringValue;
  NSLog(@"duration = %@", dataString);
  callback(@[[NSNull null], dataString]);
}

RCT_EXPORT_METHOD(startRecording) {
  if (![SCRecorder sharedRecorder].isRecording)
    [[SCRecorder sharedRecorder] startRunning];
}

RCT_EXPORT_METHOD(stopRecording) {
  
  [[SCRecorder sharedRecorder] stopRunning];
  [[SCRecorder sharedRecorder] pause];
}

RCT_EXPORT_METHOD(resetSession) {
  
  SCRecordSession *recordSession = [SCRecordSession recordSession];
  
  if (recordSession != nil) {
    [SCRecorder sharedRecorder].session = nil;
  }
  
  [self prepareSession:^(NSArray *response) {
    
  }];
  [[SCRecorder sharedRecorder] startRunning];
}

RCT_EXPORT_METHOD(updateFocus:(nonnull NSNumber*)isFocus)
{
  AVCaptureDevice *divice = [SCRecorder sharedRecorder].videoDevice;
  NSError *error = nil;
  if (!divice) {
    return;
  }
  NSLog(@"Record mthod called %@", isFocus.stringValue);
  
  if ( [divice lockForConfiguration:&error] ) {
    [divice setExposureTargetBias:isFocus.floatValue completionHandler:nil];
    [divice unlockForConfiguration];
  }
  else {
    NSLog( @"Could not lock device for configuration: %@", error );
  }
}

RCT_EXPORT_METHOD(fetch:(RCTResponseSenderBlock)callback)
{
  AVCaptureDevice *divice = [SCRecorder sharedRecorder].videoDevice;
  if(!divice)
    return;
  callback(@[@(divice.minExposureTargetBias), @(divice.maxExposureTargetBias)]);
}

RCT_EXPORT_METHOD(checkNewSegment:(RCTResponseSenderBlock)callback)
{
  [[SCRecorder sharedRecorder] setSegmentCheckBlock:^(SCRecorder * recorder, SCRecordSessionSegment * segment) {
    [self sendEventWithName:@"CheckNewSegment" body:segment.url];
  }];
}


RCT_EXPORT_METHOD(checkProgress:(RCTResponseSenderBlock)callback)
{
  [[SCRecorder sharedRecorder] progressCompletionBlock:^(SCRecorder * recorder, SCRecordSession * session) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self sendEventWithName:@"AppendVideo" body:@(CMTimeGetSeconds(session.duration)).stringValue];
    });
    
  }];
}
@end
